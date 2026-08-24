// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Extract token from the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user payload to the request
    next(); // Move to the next middleware or controller
  } catch (ex) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};