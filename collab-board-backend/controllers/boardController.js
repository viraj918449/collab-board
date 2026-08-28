const Board = require('../models/Board');

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
    }).populate('owner', 'fullName email');

    res.status(200).json(boards);
  } catch (error) {
    console.error('Error fetching boards:', error.message);
    res.status(500).json({ error: 'Failed to fetch boards' });
  }
};

// Create a new board
exports.createBoard = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: User ID missing from token' });
    }

    if (!name) {
      return res.status(400).json({ error: 'Board name is required' });
    }

    const newBoard = await Board.create({
      name,
      description,
      owner: userId,
      members: [userId] // Automatically add the creator as a member
    });

    res.status(201).json(newBoard);
  } catch (error) {
    console.error('Error creating board:', error.message);
    res.status(500).json({ error: 'Failed to create board' });
  }
};