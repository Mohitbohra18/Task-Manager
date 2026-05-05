const Task = require('../models/Task');
const Project = require('../models/Project');
const Team = require('../models/Team');
const User = require('../models/User');
const ApiResponse = require('../utils/ApiResponse');

const getDashboard = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';
    let projectFilter = {};
    let taskFilter = {};

    if (!isAdmin) {
      projectFilter.$or = [{ owner: req.user.id }, { members: req.user.id }];
      const userProjects = await Project.find(projectFilter).select('_id');
      const pIds = userProjects.map(p => p._id);
      taskFilter.$or = [{ project: { $in: pIds } }, { assignee: req.user.id }];
    }

    // Counts
    const totalProjects = await Project.countDocuments(projectFilter);
    const totalTasks = await Task.countDocuments(taskFilter);

    // Task status breakdown
    const tasksByStatus = await Task.aggregate([
      { $match: isAdmin ? {} : { $or: taskFilter.$or } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Task priority breakdown
    const tasksByPriority = await Task.aggregate([
      { $match: isAdmin ? {} : { $or: taskFilter.$or } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    // Project status breakdown
    const projectsByStatus = await Project.aggregate([
      { $match: isAdmin ? {} : projectFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Recent tasks
    const recentTasks = await Task.find(taskFilter)
      .populate('assignee', 'name email')
      .populate('project', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // Overdue tasks
    const overdueTasks = await Task.find({
      ...taskFilter,
      dueDate: { $lt: new Date() },
      status: { $ne: 'completed' },
    })
      .populate('assignee', 'name email')
      .populate('project', 'name')
      .sort({ dueDate: 1 })
      .limit(5);

    // Admin-only stats
    let adminStats = {};
    if (isAdmin) {
      adminStats.totalUsers = await User.countDocuments();
      adminStats.totalTeams = await Team.countDocuments();
    }

    const statusMap = {};
    tasksByStatus.forEach(s => { statusMap[s._id] = s.count; });
    const priorityMap = {};
    tasksByPriority.forEach(p => { priorityMap[p._id] = p.count; });
    const projectStatusMap = {};
    projectsByStatus.forEach(p => { projectStatusMap[p._id] = p.count; });

    return ApiResponse.success(res, {
      overview: {
        totalProjects,
        totalTasks,
        completedTasks: statusMap['completed'] || 0,
        pendingTasks: (statusMap['todo'] || 0) + (statusMap['in-progress'] || 0) + (statusMap['in-review'] || 0),
        ...adminStats,
      },
      tasksByStatus: statusMap,
      tasksByPriority: priorityMap,
      projectsByStatus: projectStatusMap,
      recentTasks,
      overdueTasks,
    });
  } catch (error) { next(error); }
};

module.exports = { getDashboard };
