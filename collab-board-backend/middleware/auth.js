const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
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
    if (!decoded._id) {
      return res.status(401).json({
        error: 'Invalid token: user ID not found'
      });
    }

    // Store authenticated user
    req.user = {
      _id: decoded._id
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