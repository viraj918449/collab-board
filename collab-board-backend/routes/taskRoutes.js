// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');

// Import the 'protect' middleware you just saved
const { protect } = require('../middleware/auth'); 

// Apply the middleware to ALL routes in this file
router.use(protect); 

// Your protected endpoints
router.get('/board/:boardId', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;