const Project = require('../models/Project');
const Task = require('../models/Task');
const ApiResponse = require('../utils/ApiResponse');

exports.globalSearch = async (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    return res.status(200).json(new ApiResponse(200, { projects: [], tasks: [] }, 'Empty query'));
  }

  const regex = new RegExp(query, 'i');

  try {
    // Search projects user is a member of or owner
    const projects = await Project.find({
      $and: [
        { name: regex },
        { $or: [{ owner: req.user._id }, { members: req.user._id }] }
      ]
    }).limit(5);

    // Search tasks assigned to user or in projects user is a member of
    const tasks = await Task.find({
      $and: [
        { title: regex },
        { $or: [{ assignee: req.user._id }, { owner: req.user._id }] }
      ]
    }).populate('project', 'name').limit(5);

    return res.status(200).json(
      new ApiResponse(200, { projects, tasks }, 'Search results fetched')
    );
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};
