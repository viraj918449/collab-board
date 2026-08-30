const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    // Get Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Not authorized, no token provided'
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Not authorized, no token provided'
      });
    }

    // Check JWT secret
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured');

      return res.status(500).json({
        error: 'Server authentication configuration error'
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Make sure user ID exists in token
    const userId = decoded._id || decoded.id || decoded.userId;

    if (!userId) {
      return res.status(401).json({
        error: 'Invalid token: user ID not found'
      });
    }

    // A token can outlive a deleted database account. Verify the account here
    // so every protected endpoint handles that case consistently.
    const user = await User.findById(userId).select('_id');
    if (!user) {
      return res.status(401).json({ error: 'Your session is no longer valid. Please sign in again.' });
    }

    // Store a consistent authenticated-user shape for all routes.
    req.user = {
      _id: user._id,
      id: user._id.toString()
    };

    next();

  } catch (error) {

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token'
      });
    }

    console.error('Authentication error:', error);

    return res.status(401).json({
      error: 'Not authorized, token failed'
    });
  }
};

module.exports = protect;
