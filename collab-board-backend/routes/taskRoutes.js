const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// 1. Import the protect middleware correctly (no curly braces)
const protect = require('../middleware/auth');

// 2. Apply the protect middleware to ALL task routes 
// (This is likely where your line 12 error was happening!)
router.use(protect);

// 3. Define the routes
router.get('/:boardId', taskController.getTasks);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;