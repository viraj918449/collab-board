require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); 

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes'); 
<<<<<<< HEAD
const boardRoutes = require('./routes/boardRoutes'); // Added board routes
=======
const boardRoutes = require('./routes/boardRoutes');

// 2. Run the database connection
connectDB();
>>>>>>> 6cdf0a70bec9001ce806a1fd7563dab54fe02a58

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
<<<<<<< HEAD
app.use('/api/tasks', taskRoutes);
app.use('/api/boards', boardRoutes); // Registered board routes
=======
app.use('/api/boards', boardRoutes);
app.use('/api/tasks', taskRoutes); // Tasks are now fully active!
>>>>>>> 6cdf0a70bec9001ce806a1fd7563dab54fe02a58

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Collab-board API is running!' });
});

const PORT = process.env.PORT || 5000;
<<<<<<< HEAD

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
=======
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
>>>>>>> 6cdf0a70bec9001ce806a1fd7563dab54fe02a58
