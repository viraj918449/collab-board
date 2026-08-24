// controllers/authController.js
const jwt = require('jsonwebtoken');

// Temporary mock array (will be replaced by MongoDB later)
let users = [];

exports.register = (req, res) => {
  const { email, password } = req.body;
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }
  
  const newUser = { id: Date.now(), email, password };
  users.push(newUser);
  
  res.status(201).json({ message: 'User registered successfully' });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  
  // Find user with matching credentials
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Generate JWT valid for 1 hour
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
  res.json({ token, email: user.email });
};