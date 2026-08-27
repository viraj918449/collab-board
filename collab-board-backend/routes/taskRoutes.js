// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware'); // Your JWT protection

// All task routes require the user to be logged in
router.use(protect); 

// Route to get tasks for a specific board
router.get('/board/:boardId', getTasks);

// Routes for creating, updating, and deleting tasks
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;