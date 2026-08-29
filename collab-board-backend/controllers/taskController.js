const Task = require('../models/Task');

// Get all tasks for a specific board
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ boardId: req.params.boardId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    // 1. Verify user is attached (from the protect middleware)
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID missing from token' });
    }

    // 2. Validate request
    if (!req.body.title || !req.body.boardId) {
      return res.status(400).json({ message: 'Please add a task title and boardId' });
    }

    // 3. Create the task in MongoDB
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      boardId: req.body.boardId,
      status: req.body.status || 'To Do',       // Default to first Kanban column
      priority: req.body.priority || 'Medium',  // Default priority
      user: userId 
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a task (Used for shifting columns: 'To Do' -> 'Doing')
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();

    res.status(200).json({ id: req.params.id, message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};