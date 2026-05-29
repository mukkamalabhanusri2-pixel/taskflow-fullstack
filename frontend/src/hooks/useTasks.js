/**
 * useTasks Hook
 * Manages task state, CRUD operations, and filtering
 */

import { useState, useEffect, useCallback } from 'react';
import { tasksAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useTasks = (initialFilters = {}) => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    search: '',
    sortBy: 'createdAt',
    order: 'desc',
    ...initialFilters,
  });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  // ============================================================
  // Fetch Tasks
  // ============================================================
  const fetchTasks = useCallback(async (customFilters = {}) => {
    setLoading(true);
    try {
      const params = { ...filters, ...customFilters };
      // Remove empty string params
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);

      const { data } = await tasksAPI.getAll(params);
      setTasks(data.tasks);
      setPagination({ page: data.page, pages: data.pages, total: data.total });
    } catch (error) {
      toast.error(error.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // ============================================================
  // Fetch Stats
  // ============================================================
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const { data } = await tasksAPI.getStats();
      setStats(data.stats);
    } catch (error) {
      console.error('Stats error:', error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // ============================================================
  // Create Task
  // ============================================================
  const createTask = async (taskData) => {
    const { data } = await tasksAPI.create(taskData);
    setTasks((prev) => [data.task, ...prev]);
    toast.success('Task created!');
    await fetchStats();
    return data.task;
  };

  // ============================================================
  // Update Task
  // ============================================================
  const updateTask = async (id, taskData) => {
    const { data } = await tasksAPI.update(id, taskData);
    setTasks((prev) => prev.map((t) => (t._id === id ? data.task : t)));
    toast.success('Task updated!');
    await fetchStats();
    return data.task;
  };

  // ============================================================
  // Delete Task
  // ============================================================
  const deleteTask = async (id) => {
    await tasksAPI.delete(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
    toast.success('Task deleted');
    await fetchStats();
  };

  // ============================================================
  // Update Filters
  // ============================================================
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Refetch when filters change
  useEffect(() => {
    fetchTasks();
  }, [filters]);

  return {
    tasks,
    stats,
    loading,
    statsLoading,
    filters,
    pagination,
    updateFilters,
    fetchTasks,
    fetchStats,
    createTask,
    updateTask,
    deleteTask,
  };
};
