const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const protect = require('../middleware/auth'); 
const User = require('../models/User');

// --- PUBLIC ROUTES ---
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);

// --- PROTECTED ROUTE ---
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Your session is no longer valid. Please sign in again.' });
    }

    // Existing token sessions should also appear online without requiring
    // the member to sign out and sign in again.
    if (user.status !== 'Online') {
      user.status = 'Online';
      await user.save();
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- UPDATE CURRENT USER PROFILE ---
router.put('/me', protect, async (req, res) => {
  try {
    const { name, email, bio, location, website, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(401).json({ message: 'Your session is no longer valid. Please sign in again.' });
    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) return res.status(400).json({ message: 'Name is required' });
      user.name = name.trim();
    }
    if (email !== undefined) {
      const normalizedEmail = String(email).trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return res.status(400).json({ message: 'A valid email is required' });
      const duplicate = await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } });
      if (duplicate) return res.status(409).json({ message: 'That email is already in use' });
      user.email = normalizedEmail;
    }
    for (const field of ['bio', 'location', 'website', 'avatar']) {
      if (req.body[field] !== undefined) {
        if (typeof req.body[field] !== 'string') return res.status(400).json({ message: `${field} must be text` });
        user[field] = req.body[field].trim();
      }
    }
    await user.save();
    res.json(await User.findById(user._id).select('-password'));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
