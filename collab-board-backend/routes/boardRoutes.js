const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const protect = require('../middleware/auth');
const Board = require('../models/Board');
const Task = require('../models/Task');
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
// HELPER: CHECK BOARD OWNER
// ==========================================
const isBoardOwner = (board, userId) => {
  if (!board || !userId) {
    return false;
  }

  return board.owner.toString() === userId.toString();
};

// ==========================================
// GET ALL BOARDS FOR LOGGED-IN USER
// GET /api/boards
// ==========================================
router.get('/', protect, async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: 'User authentication information not found'
      });
    }

    const boards = await Board.find({
      members: userId
    })
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .sort({ updatedAt: -1 });

    res.status(200).json(boards);
  } catch (err) {
    console.error('Get boards error:', err);

    res.status(500).json({
      message: 'Failed to fetch boards',
      error: err.message
    });
  }
});

// ==========================================
// GET ONE BOARD
// GET /api/boards/:id
// ==========================================
router.get('/:id', protect, async (req, res) => {
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
        message: 'Invalid board ID'
      });
    }

    const board = await Board.findById(id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

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

    res.status(200).json(board);
  } catch (err) {
    console.error('Get board error:', err);

    res.status(500).json({
      message: 'Failed to fetch board',
      error: err.message
    });
  }
});

// ==========================================
// CREATE BOARD
// POST /api/boards
// ==========================================
router.post('/', protect, async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: 'User authentication information not found'
      });
    }

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        message: 'Board title is required'
      });
    }

    const newBoard = new Board({
      title: title.trim(),
      description:
        typeof description === 'string'
          ? description.trim()
          : '',
      owner: userId,
      members: [userId]
    });

    const savedBoard = await newBoard.save();

    await savedBoard.populate('owner', 'name email');
    await savedBoard.populate('members', 'name email');

    res.status(201).json(savedBoard);
  } catch (err) {
    console.error('Create board error:', err);

    res.status(500).json({
      message: 'Failed to create board',
      error: err.message
    });
  }
});

// ==========================================
// UPDATE BOARD
// PUT /api/boards/:id
// ==========================================
router.put('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: 'User authentication information not found'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid board ID'
      });
    }

    const board = await Board.findById(id);

    if (!board) {
      return res.status(404).json({
        message: 'Board not found'
      });
    }

    // Only owner can edit board
    if (!isBoardOwner(board, userId)) {
      return res.status(403).json({
        message: 'Only the board owner can edit this board'
      });
    }

    if (title !== undefined) {
      if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({
          message: 'Board title cannot be empty'
        });
      }

      board.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== 'string') {
        return res.status(400).json({
          message: 'Description must be a string'
        });
      }

      board.description = description.trim();
    }

    const updatedBoard = await board.save();

    await updatedBoard.populate('owner', 'name email');
    await updatedBoard.populate('members', 'name email');

    res.status(200).json(updatedBoard);
  } catch (err) {
    console.error('Update board error:', err);

    res.status(500).json({
      message: 'Failed to update board',
      error: err.message
    });
  }
});

// ==========================================
// ADD MEMBER
// POST /api/boards/:id/members
// ==========================================
router.post('/:id/members', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const currentUserId = getUserId(req);

    if (!currentUserId) {
      return res.status(401).json({
        message: 'User authentication information not found'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid board ID'
      });
    }

    if (!userId) {
      return res.status(400).json({
        message: 'User ID is required'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: 'Invalid user ID'
      });
    }

    const board = await Board.findById(id);

    if (!board) {
      return res.status(404).json({
        message: 'Board not found'
      });
    }

    // Only owner can add members
    if (!isBoardOwner(board, currentUserId)) {
      return res.status(403).json({
        message: 'Only the board owner can add members'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    if (isBoardMember(board, userId)) {
      return res.status(400).json({
        message: 'User is already a member of this board'
      });
    }

    board.members.push(userId);

    const updatedBoard = await board.save();

    await updatedBoard.populate('owner', 'name email');
    await updatedBoard.populate('members', 'name email');

    res.status(200).json({
      message: 'Member added successfully',
      board: updatedBoard
    });
  } catch (err) {
    console.error('Add member error:', err);

    res.status(500).json({
      message: 'Failed to add member',
      error: err.message
    });
  }
});

// ==========================================
// REMOVE MEMBER
// DELETE /api/boards/:id/members/:userId
// ==========================================
router.delete(
  '/:id/members/:userId',
  protect,
  async (req, res) => {
    try {
      const { id, userId } = req.params;
      const currentUserId = getUserId(req);

      if (!currentUserId) {
        return res.status(401).json({
          message: 'User authentication information not found'
        });
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          message: 'Invalid board ID'
        });
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          message: 'Invalid user ID'
        });
      }

      const board = await Board.findById(id);

      if (!board) {
        return res.status(404).json({
          message: 'Board not found'
        });
      }

      // Only owner can remove members
      if (!isBoardOwner(board, currentUserId)) {
        return res.status(403).json({
          message: 'Only the board owner can remove members'
        });
      }

      // Owner cannot be removed
      if (isBoardOwner(board, userId)) {
        return res.status(400).json({
          message: 'Board owner cannot be removed'
        });
      }

      if (!isBoardMember(board, userId)) {
        return res.status(404).json({
          message: 'User is not a member of this board'
        });
      }

      board.members = board.members.filter(
        (member) => member.toString() !== userId.toString()
      );

      const updatedBoard = await board.save();

      await updatedBoard.populate('owner', 'name email');
      await updatedBoard.populate('members', 'name email');

      res.status(200).json({
        message: 'Member removed successfully',
        board: updatedBoard
      });
    } catch (err) {
      console.error('Remove member error:', err);

      res.status(500).json({
        message: 'Failed to remove member',
        error: err.message
      });
    }
  }
);

// ==========================================
// DELETE BOARD
// DELETE /api/boards/:id
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
        message: 'Invalid board ID'
      });
    }

    const board = await Board.findById(id);

    if (!board) {
      return res.status(404).json({
        message: 'Board not found'
      });
    }

    // Only owner can delete board
    if (!isBoardOwner(board, userId)) {
      return res.status(403).json({
        message: 'Only the board owner can delete this board'
      });
    }

    // Delete all tasks belonging to this board
    await Task.deleteMany({
      boardId: board._id
    });

    // Delete board
    await board.deleteOne();

    res.status(200).json({
      message: 'Board and its tasks removed successfully'
    });
  } catch (err) {
    console.error('Delete board error:', err);

    res.status(500).json({
      message: 'Failed to delete board',
      error: err.message
    });
  }
});

module.exports = router;

