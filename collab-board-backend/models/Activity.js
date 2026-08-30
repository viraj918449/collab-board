const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true, index: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', default: null },
  type: { type: String, enum: ['task_created', 'task_updated', 'task_moved', 'task_deleted'], required: true },
  message: { type: String, required: true, trim: true },
}, { timestamps: true });

activitySchema.index({ board: 1, createdAt: -1 });
module.exports = mongoose.model('Activity', activitySchema);
