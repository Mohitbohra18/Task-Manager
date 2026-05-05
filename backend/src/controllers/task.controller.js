const Task = require('../models/Task');
const Project = require('../models/Project');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, project, assignee, dueDate, tags } = req.body;
    const projectDoc = await Project.findById(project);
    if (!projectDoc) return next(ApiError.notFound('Project not found'));

    if (req.user.role !== 'admin' && projectDoc.owner.toString() !== req.user.id &&
      !projectDoc.members.map(m => m.toString()).includes(req.user.id)) {
      return next(ApiError.forbidden('No access to this project'));
    }

    const task = await Task.create({ title, description, status, priority, project, assignee, dueDate, tags, createdBy: req.user.id });
    const populated = await Task.findById(task._id).populate('assignee', 'name email').populate('createdBy', 'name email').populate('project', 'name');
    return ApiResponse.created(res, { task: populated }, 'Task created successfully');
  } catch (error) { next(error); }
};

const getTasks = async (req, res, next) => {
  try {
    const { status, priority, project, assignee, search, page = 1, limit = 20 } = req.query;
    let filter = {};
    if (req.user.role !== 'admin') {
      const userProjects = await Project.find({ $or: [{ owner: req.user.id }, { members: req.user.id }] }).select('_id');
      filter.$or = [{ project: { $in: userProjects.map(p => p._id) } }, { assignee: req.user.id }];
    }
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (project) filter.project = project;
    if (assignee) filter.assignee = assignee;
    if (search) filter.title = { $regex: search, $options: 'i' };
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter).populate('assignee', 'name email').populate('createdBy', 'name email').populate('project', 'name').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    return ApiResponse.success(res, { tasks, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)), limit: parseInt(limit) } });
  } catch (error) { next(error); }
};

const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignee', 'name email').populate('createdBy', 'name email').populate('project', 'name');
    if (!task) return next(ApiError.notFound('Task not found'));
    return ApiResponse.success(res, { task });
  } catch (error) { next(error); }
};

const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return next(ApiError.notFound('Task not found'));
    const project = await Project.findById(task.project);
    const isAdmin = req.user.role === 'admin';
    const isCreator = task.createdBy.toString() === req.user.id;
    const isAssignee = task.assignee && task.assignee.toString() === req.user.id;
    const isProjectOwner = project && project.owner.toString() === req.user.id;
    if (!isAdmin && !isCreator && !isAssignee && !isProjectOwner) return next(ApiError.forbidden('Not authorized'));
    if (req.user.role === 'member' && !isCreator && !isProjectOwner) {
      const keys = Object.keys(req.body);
      if (!keys.every(k => k === 'status')) return next(ApiError.forbidden('Members can only update task status'));
    }
    const allowed = ['title', 'description', 'status', 'priority', 'assignee', 'dueDate', 'tags'];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    if (updates.status === 'completed') updates.completedAt = new Date();
    else if (updates.status) updates.completedAt = null;
    task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).populate('assignee', 'name email').populate('createdBy', 'name email').populate('project', 'name');
    return ApiResponse.success(res, { task }, 'Task updated');
  } catch (error) { next(error); }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return next(ApiError.notFound('Task not found'));
    if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user.id) return next(ApiError.forbidden('Not authorized'));
    await Task.findByIdAndDelete(req.params.id);
    return ApiResponse.success(res, null, 'Task deleted');
  } catch (error) { next(error); }
};

const getTasksByProject = async (req, res, next) => {
  try {
    const { status, priority } = req.query;
    let filter = { project: req.params.projectId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    const tasks = await Task.find(filter).populate('assignee', 'name email').populate('createdBy', 'name email').sort({ createdAt: -1 });
    return ApiResponse.success(res, { tasks, count: tasks.length });
  } catch (error) { next(error); }
};

const getMyTasks = async (req, res, next) => {
  try {
    const { status, priority } = req.query;
    let filter = { assignee: req.user.id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    const tasks = await Task.find(filter).populate('project', 'name').populate('createdBy', 'name email').sort({ dueDate: 1, createdAt: -1 });
    return ApiResponse.success(res, { tasks, count: tasks.length });
  } catch (error) { next(error); }
};

module.exports = { createTask, getTasks, getTask, updateTask, deleteTask, getTasksByProject, getMyTasks };
