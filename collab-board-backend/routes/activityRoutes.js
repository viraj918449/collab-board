const express = require('express');
const protect = require('../middleware/auth');
const Activity = require('../models/Activity');
const Board = require('../models/Board');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 5, 1), 50);
    const boards = await Board.find({ members: req.user._id }).select('_id');
    const activities = await Activity.find({ board: { $in: boards.map((board) => board._id) } })
      .populate('actor', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch recent activity', error: error.message });
  }
});

module.exports = router;
