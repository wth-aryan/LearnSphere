const express = require('express');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: req.user.toJSON()
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, avatar } = req.body;
    
    const updatedUser = await req.user.updateProfile({
      firstName,
      lastName,
      avatar
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser.toJSON()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get storage usage
router.get('/storage', authenticateToken, async (req, res) => {
  try {
    const File = require('../models/File');
    const totalSize = await File.getTotalSizeByUserId(req.user.id);
    
    res.json({
      used: totalSize,
      limit: req.user.storageLimit,
      percentage: (totalSize / req.user.storageLimit) * 100,
      available: req.user.storageLimit - totalSize
    });
  } catch (error) {
    console.error('Get storage error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update storage limit (admin only)
router.put('/storage/limit', authenticateToken, async (req, res) => {
  try {
    const { storageLimit } = req.body;
    
    if (!storageLimit || storageLimit < 0) {
      return res.status(400).json({ message: 'Invalid storage limit' });
    }

    const pool = require('../config/database');
    await pool.query(
      'UPDATE users SET storage_limit = $1, updated_at = NOW() WHERE id = $2',
      [storageLimit, req.user.id]
    );

    req.user.storageLimit = storageLimit;

    res.json({
      message: 'Storage limit updated successfully',
      storageLimit: req.user.storageLimit
    });
  } catch (error) {
    console.error('Update storage limit error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
