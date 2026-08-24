// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import Routes
const authRoutes = require('./routes/authRoutes');
// const taskRoutes = require('./routes/taskRoutes'); // Placeholder for our next step

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows the server to parse JSON bodies in requests

// Route Middleware
app.use('/api/auth', authRoutes);
// app.use('/api/tasks', taskRoutes); // Placeholder for our next step

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'CollabBoard API is running!' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
