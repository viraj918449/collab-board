const Board = require('../models/Board');
const Task = require('../models/Task');
const mongoose = require('mongoose');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
const isBoardMember = (board, userId) =>
  board.owner.toString() === String(userId) ||
  board.members.some((member) => member.toString() === String(userId));

const findBoard = async (id, res) => {
  if (!isValidId(id)) {
    res.status(400).json({ error: 'Invalid board id' });
    return null;
  }

  const board = await Board.findById(id);
  if (!board) {
    res.status(404).json({ error: 'Board not found' });
    return null;
  }

  return board;
};

const requireBoardMember = async (req, res, next) => {
  try {
    const board = await findBoard(req.params.id || req.params.boardId, res);
    if (!board) return;

    if (!isBoardMember(board, req.user.id)) {
      return res.status(403).json({ error: 'You do not have access to this board' });
    }

    req.board = board;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify board access' });
  }
};

const requireBoardOwner = (req, res, next) => {
  if (req.board.owner.toString() !== String(req.user.id)) {
    return res.status(403).json({ error: 'Only the board owner can perform this action' });
  }
  next();
};

// Get all boards for the logged-in user (owned or member of)
exports.getBoards = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: User ID missing from token' });
    }

    const boards = await Board.find({
      $or: [
        { owner: userId },
        { members: userId }
      ]
<<<<<<< HEAD
    }).populate('owner', 'fullName email');

    res.status(200).json(boards);
=======
    });
    
    res.json(boards);
>>>>>>> 6cdf0a70bec9001ce806a1fd7563dab54fe02a58
  } catch (error) {
    console.error('Error fetching boards:', error.message);
    res.status(500).json({ error: 'Failed to fetch boards' });
  }
};

// Create a new board
exports.createBoard = async (req, res) => {
  try {
    const { name, description } = req.body;
<<<<<<< HEAD
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: User ID missing from token' });
    }

    if (!name) {
      return res.status(400).json({ error: 'Board name is required' });
    }

=======
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Board name is required' });
    }
    
>>>>>>> 6cdf0a70bec9001ce806a1fd7563dab54fe02a58
    const newBoard = await Board.create({
      name,
      description,
      owner: userId,
      members: [userId] // Automatically add the creator as a member
    });

    res.status(201).json(newBoard);
  } catch (error) {
<<<<<<< HEAD
    console.error('Error creating board:', error.message);
    res.status(500).json({ error: 'Failed to create board' });
=======
    res.status(400).json({ error: 'Failed to create board' });
>>>>>>> 6cdf0a70bec9001ce806a1fd7563dab54fe02a58
  }
};

// Get one board. Board members may view it.
exports.getBoard = (req, res) => res.json(req.board);

// Update board details. Only the owner may update a board.
exports.updateBoard = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (name !== undefined && (!name || !name.trim())) {
      return res.status(400).json({ error: 'Board name cannot be empty' });
    }

    if (name !== undefined) req.board.name = name;
    if (description !== undefined) req.board.description = description;
    await req.board.save();
    res.json(req.board);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update board' });
  }
};

// Delete a board and the tasks that belong to it. Only the owner may delete it.
exports.deleteBoard = async (req, res) => {
  try {
    await Task.deleteMany({ boardId: req.board._id });
    await req.board.deleteOne();
    res.json({ message: 'Board and its tasks deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete board' });
  }
};

// Add a member. Only the owner may manage membership.
exports.addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!isValidId(userId)) {
      return res.status(400).json({ error: 'A valid userId is required' });
    }

    const alreadyMember = req.board.members.some((member) => member.toString() === userId);
    if (alreadyMember || req.board.owner.toString() === userId) {
      return res.status(409).json({ error: 'User is already a board member' });
    }

    req.board.members.push(userId);
    await req.board.save();
    res.status(201).json(req.board);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add board member' });
  }
};

// Remove a member. The owner cannot be removed from their own board.
exports.removeMember = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!isValidId(userId)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }
    if (req.board.owner.toString() === userId) {
      return res.status(400).json({ error: 'The board owner cannot be removed' });
    }

    const initialCount = req.board.members.length;
    req.board.members = req.board.members.filter((member) => member.toString() !== userId);
    if (req.board.members.length === initialCount) {
      return res.status(404).json({ error: 'Board member not found' });
    }

    await req.board.save();
    res.json(req.board);
  } catch (error) {
    res.status(400).json({ error: 'Failed to remove board member' });
  }
};

exports.requireBoardMember = requireBoardMember;
exports.requireBoardOwner = requireBoardOwner;
exports.isBoardMember = isBoardMember;
