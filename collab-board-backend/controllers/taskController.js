// controllers/taskController.js
const Task = require('../models/Task');

// Get all tasks for a specific board
exports.getTasks = async (req, res) => {
  try {
    const { boardId } = req.params; // Get the board ID from the URL
    const tasks = await Task.find({ boardId }); 
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// Create a new task inside a board
exports.createTask = async (req, res) => {
  try {
    const { title, tag, column, boardId } = req.body;
    
    const newTask = await Task.create({
      title,
      tag,
      column,
      boardId,
      createdBy: req.user.id // From auth middleware
    });

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
};

// Update a task (e.g., moving from 'todo' to 'done')
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedTask) return res.status(404).json({ error: 'Task not found' });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);
    
    if (!deletedTask) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};