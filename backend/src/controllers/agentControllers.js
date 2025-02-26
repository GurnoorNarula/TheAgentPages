const Agent = require('../models/Agent');

exports.registerAgent = async (req, res) => {
  try {
    const newAgent = new Agent(req.body);
    await newAgent.save();
    res.status(201).json(newAgent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find();
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ message: 'Agent not found' });
    res.json(agent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAgent = async (req, res) => {
  try {
    const updatedAgent = await Agent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedAgent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteAgent = async (req, res) => {
  try {
    await Agent.findByIdAndDelete(req.params.id);
    res.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
