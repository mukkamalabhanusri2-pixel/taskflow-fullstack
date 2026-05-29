/**
 * DashboardPage - Overview with stats, progress, and recent tasks
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import { StatsCard, SkeletonCard, EmptyState } from '../components/ui/LoadingScreen';
import TaskCard from '../components/tasks/TaskCard';

// SVG Icons
const TotalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
  </svg>
);
const InProgressIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" />
  </svg>
);
const CompletedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22,4 12,14.01 9,11.01" />
  </svg>
);
const OverdueIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const DashboardPage = () => {
  const navigate = useNavigate();
  const { tasks, stats, loading, statsLoading, updateTask, deleteTask, fetchStats } = useTasks({
    sortBy: 'updatedAt',
    order: 'desc',
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const recentTasks = tasks.slice(0, 6);

  const handleStatusChange = async (id, data) => {
    await updateTask(id, data);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) {
      await deleteTask(id);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Grid */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Overview</h2>
        {statsLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              label="Total Tasks"
              value={stats?.total ?? 0}
              icon={<TotalIcon />}
              color="indigo"
              subtitle="All your tasks"
            />
            <StatsCard
              label="In Progress"
              value={stats?.['in-progress'] ?? 0}
              icon={<InProgressIcon />}
              color="blue"
              subtitle="Currently active"
            />
            <StatsCard
              label="Completed"
              value={stats?.completed ?? 0}
              icon={<CompletedIcon />}
              color="emerald"
              subtitle={`${stats?.completionRate ?? 0}% completion rate`}
            />
            <StatsCard
              label="Overdue"
              value={stats?.overdue ?? 0}
              icon={<OverdueIcon />}
              color="red"
              subtitle="Need attention"
            />
          </div>
        )}
      </div>

      {/* Progress bar + Priority breakdown */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Completion progress */}
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Completion Progress</h3>
            <div className="flex items-end justify-between mb-3">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">{stats.completionRate}%</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {stats.completed} / {stats.total} tasks
              </span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
            <div className="flex justify-between mt-3 text-xs text-gray-400">
              {[
                { label: 'Pending', value: stats.pending, color: 'bg-gray-300' },
                { label: 'In Progress', value: stats['in-progress'], color: 'bg-blue-400' },
                { label: 'Completed', value: stats.completed, color: 'bg-emerald-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${color}`} />
                  <span>{label}: <strong className="text-gray-600 dark:text-gray-300">{value}</strong></span>
                </div>
              ))}
            </div>
          </div>

          {/* Priority breakdown */}
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Priority Breakdown</h3>
            <div className="space-y-4">
              {[
                { label: 'High Priority', key: 'high', color: 'bg-red-400', textColor: 'text-red-600 dark:text-red-400' },
                { label: 'Medium Priority', key: 'medium', color: 'bg-amber-400', textColor: 'text-amber-600 dark:text-amber-400' },
                { label: 'Low Priority', key: 'low', color: 'bg-green-400', textColor: 'text-green-600 dark:text-green-400' },
              ].map(({ label, key, color, textColor }) => {
                const val = stats.priorityBreakdown?.[key] ?? 0;
                const pct = stats.total > 0 ? (val / stats.total) * 100 : 0;
                return (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-gray-600 dark:text-gray-400">{label}</span>
                      <span className={`font-semibold ${textColor}`}>{val}</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Recent Tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recent Tasks</h2>
          <button
            onClick={() => navigate('/tasks')}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium flex items-center gap-1"
          >
            View all
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <polyline points="9,18 15,12 9,6" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : recentTasks.length === 0 ? (
          <EmptyState
            title="No tasks yet"
            description="Get started by creating your first task."
            action={
              <button onClick={() => navigate('/tasks')} className="btn-primary">
                + Create First Task
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {recentTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={() => navigate('/tasks', { state: { editTask: task } })}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
