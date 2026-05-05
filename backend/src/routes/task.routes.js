const express = require('express');
const router = express.Router();
const { createTask, getTasks, getTask, updateTask, deleteTask, getTasksByProject, getMyTasks } = require('../controllers/task.controller');
const { createTaskValidator, updateTaskValidator } = require('../validators/task.validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createTaskValidator, validate, createTask);
router.get('/', getTasks);
router.get('/my-tasks', getMyTasks);
router.get('/project/:projectId', getTasksByProject);
router.get('/:id', getTask);
router.put('/:id', updateTaskValidator, validate, updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
