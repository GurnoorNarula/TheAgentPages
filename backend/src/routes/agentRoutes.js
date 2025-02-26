const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const auth = require('../middleware/auth');

router.post('/register', auth, agentController.registerAgent);
router.get('/', auth, agentController.getAllAgents);
router.get('/:id', auth, agentController.getAgentById);
router.put('/:id', auth, agentController.updateAgent);
router.delete('/:id', auth, agentController.deleteAgent);

module.exports = router;
