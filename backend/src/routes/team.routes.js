const express = require('express');
const router = express.Router();
const { createTeam, getTeams, getTeam, updateTeam, deleteTeam, addMember, removeMember } = require('../controllers/team.controller');
const { createTeamValidator, updateTeamValidator, addMemberValidator } = require('../validators/team.validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', authorize('admin'), createTeamValidator, validate, createTeam);
router.get('/', getTeams);
router.get('/:id', getTeam);
router.put('/:id', updateTeamValidator, validate, updateTeam);
router.delete('/:id', authorize('admin'), deleteTeam);
router.post('/:id/members', addMemberValidator, validate, addMember);
router.delete('/:id/members/:userId', removeMember);

module.exports = router;
