const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const protect = require('../middleware/auth'); 
const User = require('../models/User');

// --- PUBLIC ROUTES ---
router.post('/register', authController.register);
router.post('/login', authController.login);

// --- PROTECTED ROUTE ---
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
