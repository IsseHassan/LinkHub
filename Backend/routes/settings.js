import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import {authenticateUser} from '../routes/profile.js';

const router = express.Router();

// Get user settings
router.get('/', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      email: user.email,
      notifications: user.settings?.notifications ?? true,
      publicProfile: user.settings?.publicProfile ?? true
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user settings
router.put('/', authenticateUser, async (req, res) => {
  try {
    const { email, password, notifications, publicProfile } = req.body;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Build update object
    const updateFields = {
      settings: { notifications, publicProfile }
    };

    if (email) {
      updateFields.email = email;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    res.json({
      email: user.email,
      notifications: user.settings?.notifications,
      publicProfile: user.settings?.publicProfile
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;