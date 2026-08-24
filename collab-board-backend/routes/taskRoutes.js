// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  getAllTasks, 
  createTask, 
  updateTask, 
  deleteTask 
} = require('../controllers/taskController');

// Protect all task routes with our JWT middleware
router.use(auth);

// Endpoints mapping to controller functions
router.get('/', getAllTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;