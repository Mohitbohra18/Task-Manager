const { body } = require('express-validator');

const createTaskValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Title must be between 2 and 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),

  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'in-review', 'completed'])
    .withMessage('Invalid status value'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid priority value'),

  body('project')
    .notEmpty()
    .withMessage('Project ID is required')
    .isMongoId()
    .withMessage('Invalid project ID'),

  body('assignee')
    .optional()
    .isMongoId()
    .withMessage('Invalid assignee ID'),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid due date format'),
];

const updateTaskValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Title must be between 2 and 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),

  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'in-review', 'completed'])
    .withMessage('Invalid status value'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid priority value'),

  body('assignee')
    .optional()
    .isMongoId()
    .withMessage('Invalid assignee ID'),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid due date format'),
];

module.exports = { createTaskValidator, updateTaskValidator };
