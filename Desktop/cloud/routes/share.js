const express = require('express');
const Share = require('../models/Share');
const File = require('../models/File');
const cloudStorage = require('../services/cloudStorage');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { validateShareCreate, validateShareToken, validatePassword } = require('../middleware/validation');

const router = express.Router();

// Create share link
router.post('/create', authenticateToken, validateShareCreate, async (req, res) => {
  try {
    const { fileId, shareType, password, expiresAt, maxDownloads } = req.body;

    // Check if file exists and belongs to user
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (file.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Create share
    const share = await Share.create({
      fileId,
      userId: req.user.id,
      shareType,
      password,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      maxDownloads: maxDownloads ? parseInt(maxDownloads) : null
    });

    res.status(201).json({
      message: 'Share created successfully',
      share: share.toJSON(),
      shareUrl: `${process.env.CLIENT_URL || 'http://localhost:3000'}/share/${share.shareToken}`
    });
  } catch (error) {
    console.error('Create share error:', error);
    res.status(500).json({ message: 'Failed to create share' });
  }
});

// Get share info by token
router.get('/:token', validateShareToken, async (req, res) => {
  try {
    const share = await Share.findByToken(req.params.token);
    
    if (!share) {
      return res.status(404).json({ message: 'Share not found or expired' });
    }

    if (!await share.canDownload()) {
      return res.status(410).json({ message: 'Share has expired or reached download limit' });
    }

    // Get file info (without sensitive data)
    const file = await File.findById(share.fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.json({
      share: {
        id: share.id,
        shareType: share.shareType,
        expiresAt: share.expiresAt,
        maxDownloads: share.maxDownloads,
        downloadCount: share.downloadCount,
        createdAt: share.createdAt
      },
      file: {
        id: file.id,
        originalName: file.originalName,
        fileSize: file.fileSize,
        mimeType: file.mimeType,
        createdAt: file.createdAt
      }
    });
  } catch (error) {
    console.error('Get share error:', error);
    res.status(500).json({ message: 'Failed to get share info' });
  }
});

// Download file from share
router.get('/:token/download', validateShareToken, async (req, res) => {
  try {
    const { password } = req.query;
    const share = await Share.findByToken(req.params.token);
    
    if (!share) {
      return res.status(404).json({ message: 'Share not found or expired' });
    }

    if (!await share.canDownload()) {
      return res.status(410).json({ message: 'Share has expired or reached download limit' });
    }

    // Validate password if required
    if (share.shareType === 'password') {
      if (!password || !await share.validatePassword(password)) {
        return res.status(401).json({ message: 'Invalid password' });
      }
    }

    // Get file
    const file = await File.findById(share.fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Download from cloud storage
    const downloadResult = await cloudStorage.downloadFile(file.filePath, 's3');
    
    // Update download counts
    await share.incrementDownloadCount();
    await file.updateDownloadCount();

    res.set({
      'Content-Type': file.mimeType,
      'Content-Disposition': `attachment; filename="${file.originalName}"`,
      'Content-Length': file.fileSize
    });

    res.send(downloadResult.data);
  } catch (error) {
    console.error('Share download error:', error);
    res.status(500).json({ message: 'Failed to download file' });
  }
});

// Verify share password
router.post('/:token/verify', validateShareToken, validatePassword, async (req, res) => {
  try {
    const { password } = req.body;
    const share = await Share.findByToken(req.params.token);
    
    if (!share) {
      return res.status(404).json({ message: 'Share not found or expired' });
    }

    if (share.shareType !== 'password') {
      return res.status(400).json({ message: 'This share does not require a password' });
    }

    const isValid = await share.validatePassword(password);
    
    if (isValid) {
      res.json({ message: 'Password verified successfully' });
    } else {
      res.status(401).json({ message: 'Invalid password' });
    }
  } catch (error) {
    console.error('Verify password error:', error);
    res.status(500).json({ message: 'Failed to verify password' });
  }
});

// Get user's shares
router.get('/', authenticateToken, async (req, res) => {
  try {
    const shares = await Share.findByUserId(req.user.id);
    
    res.json({
      shares: shares.map(share => share.toJSON())
    });
  } catch (error) {
    console.error('Get shares error:', error);
    res.status(500).json({ message: 'Failed to retrieve shares' });
  }
});

// Deactivate share
router.put('/:token/deactivate', authenticateToken, validateShareToken, async (req, res) => {
  try {
    const share = await Share.findByToken(req.params.token);
    
    if (!share) {
      return res.status(404).json({ message: 'Share not found' });
    }

    if (share.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await share.deactivate();

    res.json({ message: 'Share deactivated successfully' });
  } catch (error) {
    console.error('Deactivate share error:', error);
    res.status(500).json({ message: 'Failed to deactivate share' });
  }
});

// Delete share
router.delete('/:token', authenticateToken, validateShareToken, async (req, res) => {
  try {
    const share = await Share.findByToken(req.params.token);
    
    if (!share) {
      return res.status(404).json({ message: 'Share not found' });
    }

    if (share.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await share.delete();

    res.json({ message: 'Share deleted successfully' });
  } catch (error) {
    console.error('Delete share error:', error);
    res.status(500).json({ message: 'Failed to delete share' });
  }
});

module.exports = router;
