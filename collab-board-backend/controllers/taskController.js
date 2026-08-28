const Task = require('../models/Task');
const Board = require('../models/Board');
const mongoose = require('mongoose');
const { isBoardMember } = require('./boardController');

const canAccessBoard = async (boardId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(boardId)) return null;
  const board = await Board.findById(boardId);
  return board && isBoardMember(board, userId) ? board : null;
};

// Get all tasks for a specific board
exports.getTasks = async (req, res) => {
  try {
    const { boardId } = req.params; // Get the board ID from the URL
    if (!await canAccessBoard(boardId, req.user.id)) {
      return res.status(403).json({ error: 'You do not have access to this board' });
    }
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
    if (!await canAccessBoard(boardId, req.user.id)) {
      return res.status(403).json({ error: 'You do not have access to this board' });
    }
    
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
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid task id' });
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (!await canAccessBoard(task.boardId, req.user.id)) {
      return res.status(403).json({ error: 'You do not have access to this task' });
    }
    if (req.body.boardId && !await canAccessBoard(req.body.boardId, req.user.id)) {
      return res.status(403).json({ error: 'You do not have access to the target board' });
    }

    const allowedUpdates = ['title', 'tag', 'column', 'boardId'];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) task[field] = req.body[field];
    });
    const updatedTask = await task.save();

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
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid task id' });
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (!await canAccessBoard(task.boardId, req.user.id)) {
      return res.status(403).json({ error: 'You do not have access to this task' });
    }
    await task.deleteOne();
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};
