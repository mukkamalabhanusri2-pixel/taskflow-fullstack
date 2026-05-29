/**
 * TasksPage - Full task management with CRUD, filters, and modal
 */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/tasks/TaskCard';
import TaskFormModal from '../components/tasks/TaskFormModal';
import TaskFilters from '../components/tasks/TaskFilters';
import { EmptyState, SkeletonCard, ConfirmDialog } from '../components/ui/LoadingScreen';
import toast from 'react-hot-toast';

const TasksPage = () => {
  const location = useLocation();
  const { tasks, loading, filters, updateFilters, createTask, updateTask, deleteTask, pagination } = useTasks();

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Handle edit from dashboard navigation
  useEffect(() => {
    if (location.state?.editTask) {
      setEditingTask(location.state.editTask);
      setShowModal(true);
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  const handleCreate = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleModalSubmit = async (data) => {
    if (editingTask) {
      await updateTask(editingTask._id, data);
    } else {
      await createTask(data);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      await deleteTask(deleteId);
      setDeleteId(null);
    } catch (err) {
      toast.error('Failed to delete task');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleStatusChange = async (id, data) => {
    await updateTask(id, data);
  };

  const resetFilters = () => {
    updateFilters({ status: '', priority: '', category: '', search: '', sortBy: 'createdAt', order: 'desc' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Tasks</h2>
            <span className="px-2.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-semibold rounded-full">
              {pagination.total}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {pagination.total === 0
              ? 'No tasks yet — create your first one!'
              : `Showing ${tasks.length} of ${pagination.total} tasks`}
          </p>
        </div>

        <button onClick={handleCreate} className="btn-primary sm:w-auto w-full py-3 px-5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Task
        </button>
      </div>

      {/* Filters */}
      <TaskFilters filters={filters} onFilterChange={updateFilters} onReset={resetFilters} />

      {/* Task Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          title={filters.search || filters.status || filters.priority ? 'No tasks match your filters' : 'No tasks yet'}
          description={
            filters.search || filters.status || filters.priority
              ? 'Try adjusting your search or filters to find what you need.'
              : 'Get started by creating your first task. Stay organized and track your progress!'
          }
          action={
            <div className="flex gap-3">
              {(filters.search || filters.status || filters.priority) && (
                <button onClick={resetFilters} className="btn-secondary">Clear Filters</button>
              )}
              <button onClick={handleCreate} className="btn-primary">
                + Create Task
              </button>
            </div>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={handleEdit}
              onDelete={(id) => setDeleteId(id)}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <TaskFormModal
          task={editingTask}
          onSubmit={handleModalSubmit}
          onClose={() => { setShowModal(false); setEditingTask(null); }}
        />
      )}

      {deleteId && (
        <ConfirmDialog
          title="Delete Task"
          message="Are you sure you want to delete this task? This action cannot be undone."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteId(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

export default TasksPage;
