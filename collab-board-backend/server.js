// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// 1. Import the MongoDB connection
const connectDB = require('./config/db'); 

// Import Routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes'); 
const boardRoutes = require('./routes/boardRoutes');

// 2. Run the database connection
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows the server to parse JSON bodies in requests

// Route Middleware
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/tasks', taskRoutes); // Tasks are now fully active!

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Collab-board API is running!' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
