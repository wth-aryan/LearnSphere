const express = require('express');
const multer = require('multer');
const File = require('../models/File');
const cloudStorage = require('../services/cloudStorage');
const encryptionService = require('../services/encryption');
const { authenticateToken } = require('../middleware/auth');
const { validateFileUpload, validateFileId, validateFileSearch } = require('../middleware/validation');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 * 1024, // 10GB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types for now, but you can add restrictions here
    cb(null, true);
  }
});

// Upload file
router.post('/upload', authenticateToken, upload.single('file'), validateFileUpload, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, mimetype, size, buffer } = req.file;
    const { isEncrypted = false, isPublic = false } = req.body;

    // Check storage limit
    const currentStorage = await File.getTotalSizeByUserId(req.user.id);
    if (currentStorage + size > req.user.storageLimit) {
      return res.status(400).json({ 
        message: 'Storage limit exceeded',
        currentStorage,
        limit: req.user.storageLimit
      });
    }

    // Generate file checksum
    const checksum = File.generateChecksum(buffer);
    
    // Check for duplicate files
    const existingFile = await File.findByChecksum(checksum);
    if (existingFile && existingFile.userId === req.user.id) {
      return res.status(400).json({ message: 'File already exists' });
    }

    let fileBuffer = buffer;
    let encryptionKey = null;

    // Encrypt file if requested
    if (isEncrypted) {
      encryptionKey = File.generateEncryptionKey();
      const encrypted = encryptionService.encryptFile(buffer, encryptionKey);
      fileBuffer = encrypted.encrypted;
    }

    // Upload to cloud storage
    const fileName = `${Date.now()}-${originalname}`;
    const uploadResult = await cloudStorage.uploadFile(
      fileBuffer,
      fileName,
      mimetype,
      {
        provider: 's3', // Default to S3, can be made configurable
        folder: `users/${req.user.id}`,
        encryption: isEncrypted
      }
    );

    // Save file record to database
    const file = await File.create({
      userId: req.user.id,
      originalName: originalname,
      fileName: fileName,
      filePath: uploadResult.filePath,
      fileSize: size,
      mimeType: mimetype,
      encryptionKey: encryptionKey,
      checksum: checksum,
      isEncrypted: isEncrypted,
      isPublic: isPublic
    });

    // Update user storage usage
    await req.user.updateStorageUsed(size);

    res.status(201).json({
      message: 'File uploaded successfully',
      file: file.toJSON()
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ message: 'Failed to upload file' });
  }
});

// Get user's files
router.get('/', authenticateToken, validateFileSearch, async (req, res) => {
  try {
    const { q, limit = 50, offset = 0 } = req.query;
    
    let files;
    if (q) {
      files = await File.searchFiles(req.user.id, q, parseInt(limit), parseInt(offset));
    } else {
      files = await File.findByUserId(req.user.id, parseInt(limit), parseInt(offset));
    }

    res.json({
      files: files.map(file => file.toJSON()),
      total: files.length
    });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ message: 'Failed to retrieve files' });
  }
});

// Get file by ID
router.get('/:id', authenticateToken, validateFileId, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (file.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ file: file.toJSON() });
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ message: 'Failed to retrieve file' });
  }
});

// Download file
router.get('/:id/download', authenticateToken, validateFileId, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (file.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Download from cloud storage
    const downloadResult = await cloudStorage.downloadFile(file.filePath, 's3');
    
    // Decrypt if necessary
    let fileBuffer = downloadResult.data;
    if (file.isEncrypted && file.encryptionKey) {
      // In a real implementation, you would decrypt using the user's private key
      // For this example, we'll skip decryption
      res.status(501).json({ message: 'File decryption not implemented yet' });
      return;
    }

    // Update download count
    await file.updateDownloadCount();

    res.set({
      'Content-Type': file.mimeType,
      'Content-Disposition': `attachment; filename="${file.originalName}"`,
      'Content-Length': file.fileSize
    });

    res.send(fileBuffer);
  } catch (error) {
    console.error('File download error:', error);
    res.status(500).json({ message: 'Failed to download file' });
  }
});

// Update file visibility
router.put('/:id/visibility', authenticateToken, validateFileId, async (req, res) => {
  try {
    const { isPublic } = req.body;
    const file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (file.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await file.updateVisibility(isPublic);

    res.json({
      message: 'File visibility updated',
      file: file.toJSON()
    });
  } catch (error) {
    console.error('Update visibility error:', error);
    res.status(500).json({ message: 'Failed to update file visibility' });
  }
});

// Delete file
router.delete('/:id', authenticateToken, validateFileId, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (file.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete from cloud storage
    await cloudStorage.deleteFile(file.filePath, 's3');

    // Delete from database
    await file.delete();

    // Update user storage usage
    await req.user.updateStorageUsed(-file.fileSize);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('File delete error:', error);
    res.status(500).json({ message: 'Failed to delete file' });
  }
});

// Get storage usage
router.get('/storage/usage', authenticateToken, async (req, res) => {
  try {
    const totalSize = await File.getTotalSizeByUserId(req.user.id);
    
    res.json({
      used: totalSize,
      limit: req.user.storageLimit,
      percentage: (totalSize / req.user.storageLimit) * 100
    });
  } catch (error) {
    console.error('Storage usage error:', error);
    res.status(500).json({ message: 'Failed to get storage usage' });
  }
});

module.exports = router;
