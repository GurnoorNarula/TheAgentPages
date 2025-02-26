const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

router.post('/submit', auth, taskController.submitTask);
router.get('/', auth, taskController.getAllTasks);
router.get('/:id', auth, taskController.getTaskById);
router.put('/:id/result', auth, taskController.updateTaskResult);

module.exports = router;
