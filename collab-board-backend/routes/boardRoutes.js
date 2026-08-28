const express = require('express');
const router = express.Router();
const { getBoards, createBoard } = require('../controllers/boardController');
const verifyToken = require('../middleware/auth');

// Route to get all boards for the authenticated user
router.get('/', verifyToken, getBoards);

// Route to create a new board
router.post('/', verifyToken, createBoard);

module.exports = router;