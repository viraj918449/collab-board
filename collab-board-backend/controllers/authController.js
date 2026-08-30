const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendPasswordResetPin } = require('../services/mailer');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { _id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Name, email and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists'
      });
    }

    // Create user
    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password,
      status: 'Online',
      ...(role?.trim() ? { role: role.trim() } : {})
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error('Register error:', err);

    res.status(500).json({
      error: err.message
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // A successful sign-in means this member should be visible in Team's
    // "Online Now" total immediately.
    if (user.status !== 'Online') {
      user.status = 'Online';
      await user.save();
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error('Login error:', err);

    res.status(500).json({
      error: err.message
    });
  }
};

// Send a four-digit, time-limited password reset PIN.
exports.requestPasswordReset = async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await User.findOne({ email }).select('+resetPinHash +resetPinExpiresAt +resetPinAttempts');
    // Keep this response identical for unknown accounts to avoid revealing registered emails.
    if (!user) return res.json({ message: 'If an account exists for this email, a PIN has been sent.' });

    const pin = crypto.randomInt(1000, 10000).toString();
    user.resetPinHash = await bcrypt.hash(pin, 10);
    user.resetPinExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.resetPinAttempts = 0;
    await user.save();

    await sendPasswordResetPin({ email: user.email, pin });
    res.json({ message: 'If an account exists for this email, a PIN has been sent.' });
  } catch (err) {
    console.error('Password reset request error:', err);
    res.status(503).json({ error: 'Unable to send reset PIN. Please try again later.' });
  }
};

// Verify a reset PIN and update the password.
exports.resetPassword = async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const pin = String(req.body.pin || '').trim();
    const newPassword = String(req.body.newPassword || '');
    if (!email || !/^\d{4}$/.test(pin) || newPassword.length < 6) {
      return res.status(400).json({ error: 'Enter a valid 4-digit PIN and a password with at least 6 characters.' });
    }

    const user = await User.findOne({ email }).select('+resetPinHash +resetPinExpiresAt +resetPinAttempts');
    if (!user || !user.resetPinHash || !user.resetPinExpiresAt || user.resetPinExpiresAt < new Date()) {
      return res.status(400).json({ error: 'This PIN is invalid or has expired. Request a new PIN.' });
    }
    if (user.resetPinAttempts >= 5) {
      return res.status(429).json({ error: 'Too many incorrect PIN attempts. Request a new PIN.' });
    }

    const isPinValid = await bcrypt.compare(pin, user.resetPinHash);
    if (!isPinValid) {
      user.resetPinAttempts += 1;
      await user.save();
      return res.status(400).json({ error: 'Incorrect PIN. Please try again.' });
    }

    user.password = newPassword;
    user.resetPinHash = null;
    user.resetPinExpiresAt = null;
    user.resetPinAttempts = 0;
    await user.save();
    res.json({ message: 'Password updated successfully. You can now sign in.' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ error: 'Unable to reset password. Please try again.' });
  }
};

// Change password for an authenticated user.
exports.changePassword = async (req, res) => {
  try {
    const currentPassword = String(req.body.currentPassword || '');
    const newPassword = String(req.body.newPassword || '');

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
    }
    if (currentPassword === newPassword) {
      return res.status(400).json({ error: 'Your new password must be different from your current password.' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Your session is no longer valid. Please sign in again.' });
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Your current password is incorrect.' });
    }

    // The User model hashes a modified password before saving.
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: 'Unable to update your password. Please try again.' });
  }
};
