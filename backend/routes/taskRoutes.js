/**
 * Task Routes
 * GET    /api/tasks          - Get all tasks (with filters)
 * POST   /api/tasks          - Create task
 * GET    /api/tasks/stats    - Get task statistics
 * GET    /api/tasks/:id      - Get single task
 * PUT    /api/tasks/:id      - Update task
 * DELETE /api/tasks/:id      - Delete task
 * PATCH  /api/tasks/bulk-update - Bulk update status
 */

const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
  bulkUpdateStatus,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { taskValidation } = require('../middleware/validationMiddleware');

// All task routes require authentication
router.use(protect);

router.get('/stats', getTaskStats);
router.patch('/bulk-update', bulkUpdateStatus);

router.route('/').get(getTasks).post(taskValidation, createTask);

router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);

module.exports = router;
