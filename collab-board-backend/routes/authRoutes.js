const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const protect = require('../middleware/auth'); // Imports the middleware
const User = require('../models/User');

// --- PUBLIC ROUTES ---
router.post('/register', authController.register);
router.post('/login', authController.login);

// --- PROTECTED ROUTE (Line 14 area) ---
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;