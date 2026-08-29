const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const protect = require('../middleware/auth'); // Import your middleware
const User = require('../models/User');

// --- PUBLIC ROUTES (No token needed) ---
router.post('/register', authController.register);
router.post('/login', authController.login);

// --- PROTECTED ROUTES (Requires valid JWT token) ---

// Example: Get current logged-in user profile
router.get('/me', protect, async (req, res) => {
  try {
    // Because the 'protect' middleware ran, we now have access to req.user.id
    const user = await User.findById(req.user.id).select('-password'); // Exclude password from result
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;