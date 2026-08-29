const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const Board = require('../models/Board'); // Ensure you have a Board model created

// --- GET ALL BOARDS FOR LOGGED-IN USER ---
router.get('/', protect, async (req, res) => {
  try {
    const boards = await Board.find({ members: req.user.id });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- CREATE A NEW BOARD ---
router.post('/', protect, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Board title is required' });
    }

    const newBoard = new Board({
      title,
      description,
      owner: req.user.id,
      members: [req.user.id] // Automatically include creator as a member
    });

    const savedBoard = await newBoard.save();
    res.status(201).json(savedBoard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- DELETE A BOARD ---
router.delete('/:id', protect, async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Check if the user is the owner of the board
    if (board.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this board' });
    }

    await board.deleteOne();
    res.json({ message: 'Board removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;