const express = require('express');
const router = express.Router();
const { createProject, getProjects, getProject, updateProject, deleteProject, addMember, removeMember } = require('../controllers/project.controller');
const { createProjectValidator, updateProjectValidator } = require('../validators/project.validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');

router.use(protect); // All routes require auth

router.post('/', authorize('admin'), createProjectValidator, validate, createProject);
router.get('/', getProjects);
router.get('/:id', getProject);
router.put('/:id', updateProjectValidator, validate, updateProject);
router.delete('/:id', authorize('admin'), deleteProject);
router.post('/:id/members', addMember);
router.delete('/:id/members/:userId', removeMember);

module.exports = router;
