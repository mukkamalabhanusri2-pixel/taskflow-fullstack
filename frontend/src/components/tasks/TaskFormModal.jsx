/**
 * TaskFormModal - Create and Edit Task Modal
 */

import React, { useState, useEffect } from 'react';
import { Spinner } from '../ui/LoadingScreen';

const CATEGORIES = ['General', 'Design', 'Development', 'Backend', 'Frontend', 'DevOps', 'Bug Fix', 'Review', 'Documentation', 'Marketing', 'Planning', 'Maintenance', 'Meeting', 'Research'];

const TaskFormModal = ({ task, onSubmit, onClose }) => {
  const isEditing = !!task;

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    category: 'General',
    tags: '',
    dueDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Pre-fill form when editing
  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        category: task.category || 'General',
        tags: task.tags?.join(', ') || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : '',
      });
    }
  }, [task]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (form.title.length > 100) errs.title = 'Title too long';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        dueDate: form.dueDate || null,
      };
      await onSubmit(payload);
      onClose();
    } catch (error) {
      // Errors are handled by the hook with toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="card w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Edit Task' : 'Create New Task'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {isEditing ? 'Update task details' : 'Add a new task to your list'}
            </p>
          </div>
          <button onClick={onClose} className="btn-ghost p-2 rounded-lg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="label">Title <span className="text-red-500">*</span></label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              className={`input-field ${errors.title ? 'border-red-400 focus:ring-red-400/30' : ''}`}
              autoFocus
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="label">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add more details about this task..."
              rows={3}
              className="input-field resize-none"
            />
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="input-field">
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} className="input-field">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Category + Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="input-field">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="input-field"
                min={new Date().toISOString().slice(0, 10)}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="label">Tags</label>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="design, frontend, urgent (comma-separated)"
              className="input-field"
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Separate tags with commas</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 btn-ghost border border-[var(--border-color)] justify-center py-3">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 btn-primary py-3">
              {loading && <Spinner size="xs" />}
              {isEditing ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
