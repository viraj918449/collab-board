// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  tag: { 
    type: String, 
    required: true 
  },
  column: { 
    type: String, 
    default: 'todo', 
    enum: ['todo', 'inprogress', 'done'] 
  },
  boardId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Board', 
    required: true // Now every task MUST belong to a board
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Task', taskSchema);