const express = require('express');
const router = express.Router();
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
