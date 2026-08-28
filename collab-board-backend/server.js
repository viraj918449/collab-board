require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); 

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes'); 
const boardRoutes = require('./routes/boardRoutes'); // Added board routes

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/boards', boardRoutes); // Registered board routes

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Collab-board API is running!' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();