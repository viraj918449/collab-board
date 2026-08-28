const Board = require('../models/Board');

// Get all boards for the logged-in user (boards they own OR are a member of)
exports.getBoards = async (req, res) => {
  try {
    const boards = await Board.find({
      $or: [
        { owner: req.user.id },
        { members: req.user.id }
      ]
    }).populate('owner', 'fullName email'); // Pulls in the owner's name
    
    res.json(boards);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch boards' });
  }
};

// Create a new board
exports.createBoard = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const newBoard = await Board.create({
      name,
      description,
      owner: req.user.id,
      members: [req.user.id] // Automatically add the creator as a member
    });

    res.status(201).json(newBoard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create board' });
  }
};