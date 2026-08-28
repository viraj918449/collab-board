const express = require('express');
const router = express.Router();
<<<<<<< HEAD
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
=======
const { protect } = require('../middleware/auth');
const {
  getBoards,
  createBoard,
  getBoard,
  updateBoard,
  deleteBoard,
  addMember,
  removeMember,
  requireBoardMember,
  requireBoardOwner
} = require('../controllers/boardController');

router.use(protect);

router.get('/', getBoards);
router.post('/', createBoard);

router.get('/:id', requireBoardMember, getBoard);
router.put('/:id', requireBoardMember, requireBoardOwner, updateBoard);
router.delete('/:id', requireBoardMember, requireBoardOwner, deleteBoard);

router.post('/:id/members', requireBoardMember, requireBoardOwner, addMember);
router.delete('/:id/members/:userId', requireBoardMember, requireBoardOwner, removeMember);

module.exports = router;
>>>>>>> 6cdf0a70bec9001ce806a1fd7563dab54fe02a58
