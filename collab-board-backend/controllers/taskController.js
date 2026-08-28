const Task = require('../models/Task');
const Board = require('../models/Board');
const mongoose = require('mongoose');
const { isBoardMember } = require('./boardController');

const canAccessBoard = async (boardId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(boardId)) return null;
  const board = await Board.findById(boardId);
  return board && isBoardMember(board, userId) ? board : null;
};

const getTasks = async (req, res) => {
  try {
<<<<<<< HEAD
    const tasks = await Task.find({ boardId: req.params.boardId });
    res.status(200).json(tasks);
=======
    const { boardId } = req.params; // Get the board ID from the URL
    if (!await canAccessBoard(boardId, req.user.id)) {
      return res.status(403).json({ error: 'You do not have access to this board' });
    }
    const tasks = await Task.find({ boardId }); 
    res.json(tasks);
>>>>>>> 6cdf0a70bec9001ce806a1fd7563dab54fe02a58
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
<<<<<<< HEAD
    if (!req.body.title) {
      return res.status(400).json({ message: 'Please add a task title' });
    }

    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      boardId: req.body.boardId,
      user: req.user.id
=======
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
>>>>>>> 6cdf0a70bec9001ce806a1fd7563dab54fe02a58
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
<<<<<<< HEAD
    const task = await Task.findById(req.params.id);
=======
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
>>>>>>> 6cdf0a70bec9001ce806a1fd7563dab54fe02a58

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
<<<<<<< HEAD
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();

    res.status(200).json({ id: req.params.id, message: 'Task removed' });
=======
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid task id' });
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (!await canAccessBoard(task.boardId, req.user.id)) {
      return res.status(403).json({ error: 'You do not have access to this task' });
    }
    await task.deleteOne();
    
    res.json({ message: 'Task deleted successfully' });
>>>>>>> 6cdf0a70bec9001ce806a1fd7563dab54fe02a58
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
<<<<<<< HEAD

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
=======
>>>>>>> 6cdf0a70bec9001ce806a1fd7563dab54fe02a58
