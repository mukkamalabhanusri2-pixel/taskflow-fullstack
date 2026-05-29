/**
 * Task Model - MongoDB Schema
 * Complete task data structure
 */

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [1, 'Title cannot be empty'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    dueDate: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    // Reference to the user who owns this task
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Subtasks array
    subtasks: [
      {
        title: { type: String, required: true, trim: true },
        completed: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    // Attachments (URLs or file references)
    attachments: [
      {
        name: String,
        url: String,
        type: String,
      },
    ],
    // Track if task is archived
    isArchived: {
      type: Boolean,
      default: false,
    },
    // Sort order for drag-and-drop (optional)
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes for faster queries ───────────────────────────────────────────────
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, priority: 1 });
taskSchema.index({ user: 1, dueDate: 1 });
taskSchema.index({ user: 1, createdAt: -1 });
taskSchema.index({ title: 'text', description: 'text', tags: 'text' }); // Full-text search

// ─── Pre-save Hook: Set completedAt timestamp ─────────────────────────────────
taskSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    if (this.status === 'completed' && !this.completedAt) {
      this.completedAt = new Date();
    } else if (this.status !== 'completed') {
      this.completedAt = undefined;
    }
  }
  next();
});

// ─── Virtual: Check if task is overdue ───────────────────────────────────────
taskSchema.virtual('isOverdue').get(function () {
  if (!this.dueDate || this.status === 'completed') return false;
  return new Date() > this.dueDate;
});

// ─── Virtual: Subtask completion percentage ───────────────────────────────────
taskSchema.virtual('subtaskProgress').get(function () {
  if (!this.subtasks || this.subtasks.length === 0) return 0;
  const completed = this.subtasks.filter((s) => s.completed).length;
  return Math.round((completed / this.subtasks.length) * 100);
});

// Include virtuals in JSON output
taskSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Task', taskSchema);
