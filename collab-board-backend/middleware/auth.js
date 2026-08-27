// middleware/auth.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  // 1. Extract token from the Authorization header safely
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  // 2. Reject if no token is found
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // 3. Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Attach the decoded user payload to the request
    req.user = decoded; 
    
    // 5. Move to the next middleware or controller
    next(); 
  } catch (ex) {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

module.exports = { protect };