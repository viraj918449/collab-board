const Task = require('../models/Task');
const Board = require('../models/Board');

const createTask = async (req, res) => {
  try {
    const {
      title,
      tag,
      status,
      priority,
      boardId,
      assignedTo
    } = req.body;

    // Check board
    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({
        error: 'Board not found'
      });
    }

    // Create task
    const task = new Task({
      title,
      tag,
      status,
      priority,
      boardId,
      createdBy: req.user._id,
      assignedTo: assignedTo || null
    });

    const savedTask = await task.save();

    // Return creator information
    await savedTask.populate(
      'createdBy',
      'username email'
    );

    // Return assigned user information if assigned
    await savedTask.populate(
      'assignedTo',
      'username email'
    );

    res.status(201).json(savedTask);

  } catch (error) {
    console.error('Create task error:', error);

    res.status(400).json({
      error: error.message
    });
  }
};

module.exports = {
  createTask
};