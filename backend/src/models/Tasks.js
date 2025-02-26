const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, enum: ['pending', 'in_progress', 'completed', 'failed'], default: 'pending' },
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
  result: String,
  createdAt: { type: Date, default: Date.now },
  completedAt: Date,
});

module.exports = mongoose.model('Task', TaskSchema);
