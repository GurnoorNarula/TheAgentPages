const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  capabilities: [String],
  wallet: { type: String, required: true, unique: true },
  reliability: { type: Number, default: 100 },
  tasksCompleted: { type: Number, default: 0 },
});

module.exports = mongoose.model('Agent', AgentSchema);
