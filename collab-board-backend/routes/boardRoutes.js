const express = require('express');
const router = express.Router();
const { getBoards, createBoard } = require('../controllers/boardController');
const verifyToken = require('../middleware/auth'); // Adjust path to your auth middleware if necessary

// @route   GET /api/boards
// @desc    Get all boards owned by or shared with the logged-in user
// @access  Private
router.get('/', verifyToken, getBoards);

// @route   POST /api/boards
// @desc    Create a new board
// @access  Private
router.post('/', verifyToken, createBoard);

module.exports = router;