const Project = require('../models/Project');
const Task = require('../models/Task');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private/Admin
 */
const createProject = async (req, res, next) => {
  try {
    const { name, description, status, priority, startDate, endDate, tags, team, members } = req.body;

    const project = await Project.create({
      name,
      description,
      status,
      priority,
      startDate,
      endDate,
      tags,
      team,
      members: members || [],
      owner: req.user.id,
    });

    const populated = await Project.findById(project._id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    return ApiResponse.created(res, { project: populated }, 'Project created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all projects (admin: all, member: own/assigned)
 * @route   GET /api/projects
 * @access  Private
 */
const getProjects = async (req, res, next) => {
  try {
    const { status, priority, search, page = 1, limit = 10 } = req.query;

    let filter = {};

    // Admin sees all; member sees only projects they own or are a member of
    if (req.user.role !== 'admin') {
      filter.$or = [
        { owner: req.user.id },
        { members: req.user.id },
      ];
    }

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Project.countDocuments(filter);

    const projects = await Project.find(filter)
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .populate('team', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return ApiResponse.success(res, {
      projects,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single project by ID
 * @route   GET /api/projects/:id
 * @access  Private
 */
const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email role')
      .populate('team', 'name description');

    if (!project) {
      return next(ApiError.notFound('Project not found'));
    }

    // Check access: admin can see all, members can only see their projects
    if (
      req.user.role !== 'admin' &&
      project.owner._id.toString() !== req.user.id &&
      !project.members.some((m) => m._id.toString() === req.user.id)
    ) {
      return next(ApiError.forbidden('You do not have access to this project'));
    }

    // Get tasks for this project
    const tasks = await Task.find({ project: project._id })
      .populate('assignee', 'name email')
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, { project, tasks });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a project
 * @route   PUT /api/projects/:id
 * @access  Private/Admin or Owner
 */
const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return next(ApiError.notFound('Project not found'));
    }

    // Only admin or project owner can update
    if (req.user.role !== 'admin' && project.owner.toString() !== req.user.id) {
      return next(ApiError.forbidden('Only admin or project owner can update this project'));
    }

    const allowedUpdates = ['name', 'description', 'status', 'priority', 'startDate', 'endDate', 'tags', 'team', 'members'];
    const updates = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    project = await Project.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
      .populate('owner', 'name email')
      .populate('members', 'name email');

    return ApiResponse.success(res, { project }, 'Project updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a project
 * @route   DELETE /api/projects/:id
 * @access  Private/Admin
 */
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(ApiError.notFound('Project not found'));
    }

    // Only admin can delete
    if (req.user.role !== 'admin') {
      return next(ApiError.forbidden('Only admins can delete projects'));
    }

    // Delete all tasks associated with this project
    await Task.deleteMany({ project: project._id });

    await Project.findByIdAndDelete(req.params.id);

    return ApiResponse.success(res, null, 'Project and associated tasks deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add member to project
 * @route   POST /api/projects/:id/members
 * @access  Private/Admin or Owner
 */
const addMember = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(ApiError.notFound('Project not found'));
    }

    if (req.user.role !== 'admin' && project.owner.toString() !== req.user.id) {
      return next(ApiError.forbidden('Not authorized'));
    }

    // Check if already a member
    if (project.members.includes(userId)) {
      return next(ApiError.badRequest('User is already a member of this project'));
    }

    project.members.push(userId);
    await project.save();

    const updated = await Project.findById(project._id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    return ApiResponse.success(res, { project: updated }, 'Member added successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove member from project
 * @route   DELETE /api/projects/:id/members/:userId
 * @access  Private/Admin or Owner
 */
const removeMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(ApiError.notFound('Project not found'));
    }

    if (req.user.role !== 'admin' && project.owner.toString() !== req.user.id) {
      return next(ApiError.forbidden('Not authorized'));
    }

    project.members = project.members.filter(
      (m) => m.toString() !== req.params.userId
    );
    await project.save();

    const updated = await Project.findById(project._id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    return ApiResponse.success(res, { project: updated }, 'Member removed successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
