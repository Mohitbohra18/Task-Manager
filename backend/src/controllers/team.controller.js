const Team = require('../models/Team');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

const createTeam = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const team = await Team.create({ name, description, owner: req.user.id, members: [{ user: req.user.id, role: 'lead' }] });
    const populated = await Team.findById(team._id).populate('owner', 'name email').populate('members.user', 'name email');
    return ApiResponse.created(res, { team: populated }, 'Team created successfully');
  } catch (error) { next(error); }
};

const getTeams = async (req, res, next) => {
  try {
    let filter = {};
    if (req.user.role !== 'admin') {
      filter.$or = [{ owner: req.user.id }, { 'members.user': req.user.id }];
    }
    const teams = await Team.find(filter).populate('owner', 'name email').populate('members.user', 'name email').sort({ createdAt: -1 });
    return ApiResponse.success(res, { teams, count: teams.length });
  } catch (error) { next(error); }
};

const getTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id).populate('owner', 'name email').populate('members.user', 'name email role');
    if (!team) return next(ApiError.notFound('Team not found'));
    return ApiResponse.success(res, { team });
  } catch (error) { next(error); }
};

const updateTeam = async (req, res, next) => {
  try {
    let team = await Team.findById(req.params.id);
    if (!team) return next(ApiError.notFound('Team not found'));
    if (req.user.role !== 'admin' && team.owner.toString() !== req.user.id) {
      return next(ApiError.forbidden('Not authorized'));
    }
    const { name, description } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (description !== undefined) updates.description = description;
    team = await Team.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).populate('owner', 'name email').populate('members.user', 'name email');
    return ApiResponse.success(res, { team }, 'Team updated');
  } catch (error) { next(error); }
};

const deleteTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return next(ApiError.notFound('Team not found'));
    if (req.user.role !== 'admin') return next(ApiError.forbidden('Only admins can delete teams'));
    await Team.findByIdAndDelete(req.params.id);
    return ApiResponse.success(res, null, 'Team deleted');
  } catch (error) { next(error); }
};

const User = require('../models/User');

const addMember = async (req, res, next) => {
  try {
    const { userId, email, role = 'member' } = req.body;
    let targetUserId = userId;

    // If email is provided, look up the user
    if (email) {
      const user = await User.findOne({ email });
      if (!user) return next(ApiError.notFound('User not found with this email'));
      targetUserId = user._id;
    }

    if (!targetUserId) return next(ApiError.badRequest('User ID or Email is required'));

    const team = await Team.findById(req.params.id);
    if (!team) return next(ApiError.notFound('Team not found'));
    
    if (req.user.role !== 'admin' && team.owner.toString() !== req.user.id) {
      return next(ApiError.forbidden('Not authorized'));
    }

    const existing = team.members.find(m => m.user.toString() === targetUserId.toString());
    if (existing) return next(ApiError.badRequest('User is already a team member'));

    team.members.push({ user: targetUserId, role });
    await team.save();

    const populated = await Team.findById(team._id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');
      
    return ApiResponse.success(res, { team: populated }, 'Member added successfully');
  } catch (error) { next(error); }
};

const removeMember = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return next(ApiError.notFound('Team not found'));
    if (req.user.role !== 'admin' && team.owner.toString() !== req.user.id) return next(ApiError.forbidden('Not authorized'));
    if (req.params.userId === team.owner.toString()) return next(ApiError.badRequest('Cannot remove team owner'));
    team.members = team.members.filter(m => m.user.toString() !== req.params.userId);
    await team.save();
    const populated = await Team.findById(team._id).populate('owner', 'name email').populate('members.user', 'name email');
    return ApiResponse.success(res, { team: populated }, 'Member removed');
  } catch (error) { next(error); }
};

module.exports = { createTeam, getTeams, getTeam, updateTeam, deleteTeam, addMember, removeMember };
