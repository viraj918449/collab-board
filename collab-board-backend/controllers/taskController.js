// controllers/taskController.js

// Temporary mock array (will be replaced by MongoDB/Mongoose later)
let tasks = [];

// GET: Retrieve all tasks
exports.getAllTasks = (req, res) => {
  // In a real app, you might filter by req.user.id here to only show the logged-in user's tasks
  res.status(200).json(tasks);
};

// POST: Create a new task
exports.createTask = (req, res) => {
  const { title, tag, column } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  const newTask = {
    id: Date.now().toString(),
    title,
    tag: tag || 'General',
    column: column || 'todo',
    userId: req.user.id, // Extracted from the JWT token via your auth middleware
    createdAt: new Date().toISOString()
  };
  
  tasks.push(newTask);
  res.status(201).json(newTask);
};

// PUT: Update an existing task (e.g., dragging to a new column)
exports.updateTask = (req, res) => {
  const { id } = req.params;
  const { title, tag, column } = req.body;
  
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // Update the task data while keeping the existing id and userId
  tasks[taskIndex] = { ...tasks[taskIndex], title, tag, column };
  
  res.status(200).json(tasks[taskIndex]);
};

// DELETE: Remove a task
exports.deleteTask = (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  res.status(200).json({ message: 'Task deleted successfully' });
};