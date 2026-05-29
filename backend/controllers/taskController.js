/**
 * Task Controller
 * Full CRUD operations for tasks with filtering, searching, and stats
 */

const Task = require('../models/Task');

// ============================================================
// @desc    Get all tasks for current user (with filters)
// @route   GET /api/tasks
// @access  Private
// ============================================================
const getTasks = async (req, res) => {
  try {
    const {
      status,
      priority,
      category,
      search,
      tag,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 20,
    } = req.query;

    // Build filter object - always filter by logged-in user
    const filter = { user: req.user._id, isArchived: false };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = new RegExp(category, 'i');
    if (tag) filter.tags = { $in: [tag] };

    // Text search across title and description
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'asc' ? 1 : -1;

    // Valid sort fields
    const validSortFields = ['createdAt', 'updatedAt', 'dueDate', 'priority', 'title'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit)),
      Task.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: tasks.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      tasks,
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching tasks.' });
  }
};

// ============================================================
// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
// @access  Private
// ============================================================
const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ============================================================
// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
// ============================================================
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, category, tags, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      status: status || 'pending',
      priority: priority || 'medium',
      category: category || 'General',
      tags: tags || [],
      dueDate: dueDate || null,
      user: req.user._id,
    });

    // Emit real-time update to user's room
    if (req.io) {
      req.io.to(req.user._id.toString()).emit('task:created', task);
    }

    res.status(201).json({
      success: true,
      message: 'Task created successfully!',
      task,
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ success: false, message: 'Server error creating task.' });
  }
};

// ============================================================
// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
// ============================================================
const updateTask = async (req, res) => {
  try {
    // Only update the user's own task
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    const allowedFields = ['title', 'description', 'status', 'priority', 'category', 'tags', 'dueDate'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    await task.save();

    // Emit real-time update
    if (req.io) {
      req.io.to(req.user._id.toString()).emit('task:updated', task);
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully!',
      task,
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ success: false, message: 'Server error updating task.' });
  }
};

// ============================================================
// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
// ============================================================
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    // Emit real-time update
    if (req.io) {
      req.io.to(req.user._id.toString()).emit('task:deleted', { _id: req.params.id });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully!',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting task.' });
  }
};

// ============================================================
// @desc    Get task statistics for dashboard
// @route   GET /api/tasks/stats
// @access  Private
// ============================================================
const getTaskStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [statusStats, priorityStats, recentTasks, overdueTasks] = await Promise.all([
      // Count by status
      Task.aggregate([
        { $match: { user: userId, isArchived: false } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),

      // Count by priority
      Task.aggregate([
        { $match: { user: userId, isArchived: false } },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),

      // Recent 5 tasks
      Task.find({ user: userId, isArchived: false })
        .sort({ updatedAt: -1 })
        .limit(5),

      // Overdue tasks count
      Task.countDocuments({
        user: userId,
        isArchived: false,
        status: { $ne: 'completed' },
        dueDate: { $lt: new Date() },
      }),
    ]);

    // Format status stats
    const stats = {
      total: 0,
      pending: 0,
      'in-progress': 0,
      completed: 0,
    };

    statusStats.forEach(({ _id, count }) => {
      stats[_id] = count;
      stats.total += count;
    });

    // Format priority stats
    const priorityBreakdown = { low: 0, medium: 0, high: 0 };
    priorityStats.forEach(({ _id, count }) => {
      priorityBreakdown[_id] = count;
    });

    // Completion rate
    const completionRate = stats.total > 0
      ? Math.round((stats.completed / stats.total) * 100)
      : 0;

    res.status(200).json({
      success: true,
      stats: {
        ...stats,
        overdue: overdueTasks,
        completionRate,
        priorityBreakdown,
        recentTasks,
      },
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching stats.' });
  }
};

// ============================================================
// @desc    Bulk update task status
// @route   PATCH /api/tasks/bulk-update
// @access  Private
// ============================================================
const bulkUpdateStatus = async (req, res) => {
  try {
    const { taskIds, status } = req.body;

    if (!taskIds || !Array.isArray(taskIds) || !status) {
      return res.status(400).json({ success: false, message: 'taskIds array and status are required.' });
    }

    await Task.updateMany(
      { _id: { $in: taskIds }, user: req.user._id },
      { status, ...(status === 'completed' ? { completedAt: new Date() } : { completedAt: null }) }
    );

    res.status(200).json({
      success: true,
      message: `${taskIds.length} task(s) updated successfully!`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, getTaskStats, bulkUpdateStatus };
