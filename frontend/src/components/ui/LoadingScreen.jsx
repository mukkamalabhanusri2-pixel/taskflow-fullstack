/**
 * UI Components Collection
 * Reusable UI primitives used throughout the app
 */

import React from 'react';

// ============================================================
// Loading Screen (full page)
// ============================================================
export const LoadingScreen = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-[var(--bg-primary)] z-50">
    <div className="text-center">
      <div className="relative w-16 h-16 mx-auto mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-100 dark:border-indigo-900" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Loading TaskFlow...</p>
    </div>
  </div>
);

export default LoadingScreen;

// ============================================================
// Spinner (inline)
// ============================================================
export const Spinner = ({ size = 'sm', className = '' }) => {
  const sizes = { xs: 'w-3 h-3', sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`${sizes[size]} rounded-full border-2 border-gray-200 border-t-indigo-500 animate-spin ${className}`} />
  );
};

// ============================================================
// Priority Badge
// ============================================================
export const PriorityBadge = ({ priority }) => {
  const config = {
    high: { label: 'High', className: 'priority-high', dot: 'bg-red-500' },
    medium: { label: 'Medium', className: 'priority-medium', dot: 'bg-amber-500' },
    low: { label: 'Low', className: 'priority-low', dot: 'bg-green-500' },
  };
  const { label, className, dot } = config[priority] || config.medium;
  return (
    <span className={`badge ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot} mr-1.5`} />
      {label}
    </span>
  );
};

// ============================================================
// Status Badge
// ============================================================
export const StatusBadge = ({ status }) => {
  const config = {
    pending: { label: 'Pending', className: 'status-pending' },
    'in-progress': { label: 'In Progress', className: 'status-in-progress' },
    completed: { label: 'Completed', className: 'status-completed' },
  };
  const { label, className } = config[status] || config.pending;
  return <span className={`badge ${className}`}>{label}</span>;
};

// ============================================================
// Empty State
// ============================================================
export const EmptyState = ({ title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
    <div className="w-20 h-20 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-5">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 text-indigo-400">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12h6M9 16h4" strokeLinecap="round" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{title}</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-6">{description}</p>
    {action}
  </div>
);

// ============================================================
// Skeleton Card
// ============================================================
export const SkeletonCard = () => (
  <div className="card p-5 animate-pulse space-y-3">
    <div className="flex items-center justify-between">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3" />
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-16" />
    </div>
    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
    <div className="flex gap-2 pt-1">
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-16" />
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-20" />
    </div>
  </div>
);

// ============================================================
// Stats Card
// ============================================================
export const StatsCard = ({ label, value, icon, color, subtitle }) => {
  const colors = {
    indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  };

  return (
    <div className="card p-5 hover:shadow-card-hover transition-all duration-300 animate-slide-up">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Confirm Dialog
// ============================================================
export const ConfirmDialog = ({ title, message, onConfirm, onCancel, loading }) => (
  <div className="modal-backdrop" onClick={onCancel}>
    <div
      className="card p-6 w-full max-w-md animate-scale-in"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-red-600 dark:text-red-400">
          <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{message}</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 btn-ghost border border-[var(--border-color)] justify-center py-2.5">
          Cancel
        </button>
        <button onClick={onConfirm} disabled={loading} className="flex-1 btn-danger py-2.5">
          {loading ? <Spinner size="xs" /> : null}
          Delete
        </button>
      </div>
    </div>
  </div>
);
