const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const protect = require('../middleware/auth');
const Task = require('../models/Task');
const Board = require('../models/Board');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Activity = require('../models/Activity');
const { emitToBoard } = require('../realtime');

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

    if (savedTask.assignedTo && savedTask.assignedTo._id.toString() !== userId.toString()) {
      await Notification.create({
        recipient: savedTask.assignedTo._id,
        actor: userId,
        type: 'task_assigned',
        message: `You were assigned to "${savedTask.title}"`,
        task: savedTask._id,
        board: board._id,
      });
    }

    emitToBoard(board._id.toString(), 'task:created', savedTask);
    await Activity.create({ actor: userId, board: board._id, task: savedTask._id, type: 'task_created', message: `created task “${savedTask.title}”` });

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

    const expectedVersion = Number(req.body.version);
    const currentVersion = Number.isInteger(task.version) ? task.version : 0;
    if (!Number.isInteger(expectedVersion) || expectedVersion < 0) {
      return res.status(400).json({ message: 'A valid task version is required' });
    }

    if (expectedVersion !== currentVersion) {
      const latestTask = await Task.findById(id)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email');
      return res.status(409).json({
        message: 'This task was changed by another user. Review the latest version and try again.',
        latestTask,
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
      assignedTo,
      version: _version
    } = req.body;
    const previousStatus = task.status;
    const previousAssignee = task.assignedTo?.toString() || null;

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

    const versionFilter = expectedVersion === 0
      ? { $or: [{ version: 0 }, { version: { $exists: false } }] }
      : { version: expectedVersion };
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, ...versionFilter },
      {
        $set: {
          title: task.title,
          tag: task.tag,
          status: task.status,
          priority: task.priority,
          assignedTo: task.assignedTo,
        },
        $inc: { version: 1 },
      },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      const latestTask = await Task.findById(id)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email');
      return res.status(409).json({
        message: 'This task was changed by another user. Review the latest version and try again.',
        latestTask,
      });
    }

    await updatedTask.populate('createdBy', 'name email');
    await updatedTask.populate('assignedTo', 'name email');

    const currentAssignee = updatedTask.assignedTo?._id?.toString() || null;
    const notifications = [];

    if (currentAssignee && currentAssignee !== previousAssignee && currentAssignee !== userId.toString()) {
      notifications.push({
        recipient: currentAssignee,
        actor: userId,
        type: 'task_assigned',
        message: `You were assigned to "${updatedTask.title}"`,
        task: updatedTask._id,
        board: board._id,
      });
    }

    if (status !== undefined && status !== previousStatus && currentAssignee && currentAssignee !== userId.toString()) {
      notifications.push({
        recipient: currentAssignee,
        actor: userId,
        type: 'task_status_changed',
        message: `"${updatedTask.title}" was moved to ${updatedTask.status}`,
        task: updatedTask._id,
        board: board._id,
      });
    }

    if (notifications.length) await Notification.insertMany(notifications);

    emitToBoard(
      board._id.toString(),
      status !== undefined && status !== previousStatus ? 'task:moved' : 'task:updated',
      updatedTask
    );
    const wasMoved = status !== undefined && status !== previousStatus;
    await Activity.create({
      actor: userId,
      board: board._id,
      task: updatedTask._id,
      type: wasMoved ? 'task_moved' : 'task_updated',
      message: wasMoved ? `moved task “${updatedTask.title}” to ${updatedTask.status}` : `updated task “${updatedTask.title}”`,
    });

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

    emitToBoard(board._id.toString(), 'task:deleted', { _id: task._id, boardId: board._id });
    await Activity.create({ actor: userId, board: board._id, task: task._id, type: 'task_deleted', message: `deleted task “${task.title}”` });

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

