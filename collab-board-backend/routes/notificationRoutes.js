const express = require('express');

const protect = require('../middleware/auth');
const Notification = require('../models/Notification');

const router = express.Router();

// GET /api/notifications?unread=true&type=task_assigned
router.get('/', protect, async (req, res) => {
  try {
    const filter = { recipient: req.user._id };

    if (req.query.unread === 'true') filter.read = false;
    if (req.query.type) filter.type = req.query.type;

    const notifications = await Notification.find(filter)
      .populate('actor', 'name email avatar')
      .populate('task', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
  }
});

// PATCH /api/notifications/read-all
router.patch('/read-all', protect, async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({ message: 'Notifications marked as read', modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update notifications', error: error.message });
  }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { $set: { read: true } },
      { new: true }
    );

    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.status(200).json(notification);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update notification', error: error.message });
  }
});

module.exports = router;
