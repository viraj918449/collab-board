const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const protect = require('../middleware/auth');
const Task = require('../models/Task');
const Board = require('../models/Board');
const User = require('../models/User');

// ==========================================
// HELPER: GET CURRENT USER ID
// ==========================================
const getUserId = (req) => {
  return req.user?._id || req.user?.id;
};

// ==========================================
// HELPER: CHECK BOARD MEMBERSHIP
// ==========================================
const isBoardMember = (board, userId) => {
  if (!board || !userId) {
    return false;
  }

  return board.members.some(
    (member) => member.toString() === userId.toString()
  );
};

// ==========================================
// GET TASKS BY BOARD
// GET /api/tasks?boardId=BOARD_ID
// ==========================================
router.get('/', protect, async (req, res) => {
  try {
    const { boardId } = req.query;
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: 'User authentication information not found'
      });
    }

    if (!boardId) {
      return res.status(400).json({
        message: 'boardId is required'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({
        message: 'Invalid board ID'
      });
    }

    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({
        message: 'Board not found'
      });
    }

    if (!isBoardMember(board, userId)) {
      return res.status(403).json({
        message: 'You do not have access to this board'
      });
    }

    const tasks = await Task.find({
      boardId: board._id
    })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (err) {
    console.error('Get tasks error:', err);

    res.status(500).json({
      message: 'Failed to fetch tasks',
      error: err.message
    });
  }
});

// ==========================================
// GET TASKS BY BOARD - ALTERNATIVE ROUTE
// GET /api/tasks/board/:boardId
// ==========================================
router.get('/board/:boardId', protect, async (req, res) => {
  try {
    const { boardId } = req.params;
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: 'User authentication information not found'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({
        message: 'Invalid board ID'
      });
    }

    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({
        message: 'Board not found'
      });
    }

    if (!isBoardMember(board, userId)) {
      return res.status(403).json({
        message: 'You do not have access to this board'
      });
    }

    const tasks = await Task.find({
      boardId: board._id
    })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (err) {
    console.error('Get tasks by board error:', err);

    res.status(500).json({
      message: 'Failed to fetch tasks',
      error: err.message
    });
  }
});

// ==========================================
// CREATE TASK
// POST /api/tasks
// ==========================================
router.post('/', protect, async (req, res) => {
  try {
    const {
      title,
      tag,
      status,
      priority,
      boardId,
      assignedTo
    } = req.body;

    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: 'User authentication information not found'
      });
    }

    // ------------------------------------------
    // Validate title
    // ------------------------------------------
    if (!title || !title.trim()) {
      return res.status(400).json({
        message: 'Title is required'
      });
    }

    // ------------------------------------------
    // Validate tag
    // ------------------------------------------
    if (!tag || !tag.trim()) {
      return res.status(400).json({
        message: 'Tag is required'
      });
    }

    // ------------------------------------------
    // Validate board ID
    // ------------------------------------------
    if (!boardId) {
      return res.status(400).json({
        message: 'boardId is required'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({
        message: 'Invalid board ID'
      });
    }

    // ------------------------------------------
    // Find board
    // ------------------------------------------
    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({
        message: 'Board not found'
      });
    }

    // ------------------------------------------
    // Check board membership
    // ------------------------------------------
    if (!isBoardMember(board, userId)) {
      return res.status(403).json({
        message: 'You do not have permission to create a task on this board'
      });
    }

    // ------------------------------------------
    // Validate assigned user
    // ------------------------------------------
    if (assignedTo) {
      if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
        return res.status(400).json({
          message: 'Invalid assigned user ID'
        });
      }

      const user = await User.findById(assignedTo);

      if (!user) {
        return res.status(404).json({
          message: 'Assigned user not found'
        });
      }

      if (!isBoardMember(board, assignedTo)) {
        return res.status(400).json({
          message: 'Assigned user is not a member of this board'
        });
      }
    }

    // ------------------------------------------
    // Create task
    // ------------------------------------------
    const newTask = new Task({
      title: title.trim(),
      tag: tag.trim(),
      status: status || 'To Do',
      priority: priority || 'Medium',
      boardId: board._id,
      createdBy: userId,
      assignedTo: assignedTo || null
    });

    const savedTask = await newTask.save();

    await savedTask.populate('createdBy', 'name email');
    await savedTask.populate('assignedTo', 'name email');

    res.status(201).json(savedTask);
  } catch (err) {
    console.error('Create task error:', err);

    res.status(500).json({
      message: 'Failed to create task',
      error: err.message
    });
  }
});

// ==========================================
// UPDATE TASK
// PUT /api/tasks/:id
// ==========================================
router.put('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: 'User authentication information not found'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid task ID'
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        message: 'Task not found'
      });
    }

    // ------------------------------------------
    // Find board
    // ------------------------------------------
    const board = await Board.findById(task.boardId);

    if (!board) {
      return res.status(404).json({
        message: 'Board associated with this task was not found'
      });
    }

    // ------------------------------------------
    // Check board membership
    // ------------------------------------------
    if (!isBoardMember(board, userId)) {
      return res.status(403).json({
        message: 'You do not have access to this board'
      });
    }

    const {
      title,
      tag,
      status,
      priority,
      assignedTo
    } = req.body;

    // ------------------------------------------
    // Update title
    // ------------------------------------------
    if (title !== undefined) {
      if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({
          message: 'Title cannot be empty'
        });
      }

      task.title = title.trim();
    }

    // ------------------------------------------
    // Update tag
    // ------------------------------------------
    if (tag !== undefined) {
      if (typeof tag !== 'string' || !tag.trim()) {
        return res.status(400).json({
          message: 'Tag cannot be empty'
        });
      }

      task.tag = tag.trim();
    }

    // ------------------------------------------
    // Update status
    // ------------------------------------------
    if (status !== undefined) {
      task.status = status;
    }

    // ------------------------------------------
    // Update priority
    // ------------------------------------------
    if (priority !== undefined) {
      task.priority = priority;
    }

    // ------------------------------------------
    // Update assigned user
    // ------------------------------------------
    if (assignedTo !== undefined) {
      if (assignedTo === null || assignedTo === '') {
        task.assignedTo = null;
      } else {
        if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
          return res.status(400).json({
            message: 'Invalid assigned user ID'
          });
        }

        const user = await User.findById(assignedTo);

        if (!user) {
          return res.status(404).json({
            message: 'Assigned user not found'
          });
        }

        if (!isBoardMember(board, assignedTo)) {
          return res.status(400).json({
            message: 'Assigned user is not a member of this board'
          });
        }

        task.assignedTo = assignedTo;
      }
    }

    const updatedTask = await task.save();

    await updatedTask.populate('createdBy', 'name email');
    await updatedTask.populate('assignedTo', 'name email');

    res.status(200).json(updatedTask);
  } catch (err) {
    console.error('Update task error:', err);

    res.status(500).json({
      message: 'Failed to update task',
      error: err.message
    });
  }
});

// ==========================================
// DELETE TASK
// DELETE /api/tasks/:id
// ==========================================
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: 'User authentication information not found'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid task ID'
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        message: 'Task not found'
      });
    }

    // ------------------------------------------
    // Find board
    // ------------------------------------------
    const board = await Board.findById(task.boardId);

    if (!board) {
      return res.status(404).json({
        message: 'Board associated with this task was not found'
      });
    }

    // ------------------------------------------
    // Check board membership
    // ------------------------------------------
    if (!isBoardMember(board, userId)) {
      return res.status(403).json({
        message: 'You do not have access to this board'
      });
    }

    // ------------------------------------------
    // Only creator or board owner can delete
    // ------------------------------------------
    const isCreator =
      task.createdBy.toString() === userId.toString();

    const isOwner =
      board.owner.toString() === userId.toString();

    if (!isCreator && !isOwner) {
      return res.status(403).json({
        message: 'You are not authorized to delete this task'
      });
    }

    await task.deleteOne();

    res.status(200).json({
      message: 'Task removed successfully'
    });
  } catch (err) {
    console.error('Delete task error:', err);

    res.status(500).json({
      message: 'Failed to delete task',
      error: err.message
    });
  }
});

module.exports = router;

