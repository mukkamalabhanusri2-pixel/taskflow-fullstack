/**
 * TaskCard - Individual task card with actions
 */

import React, { useState } from 'react';
import { format, isAfter, parseISO } from 'date-fns';
import { PriorityBadge, StatusBadge } from '../ui/LoadingScreen';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const [statusLoading, setStatusLoading] = useState(false);

  const isOverdue = task.dueDate && task.status !== 'completed' && isAfter(new Date(), parseISO(task.dueDate));

  const cycleStatus = async () => {
    const cycle = { pending: 'in-progress', 'in-progress': 'completed', completed: 'pending' };
    setStatusLoading(true);
    try {
      await onStatusChange(task._id, { status: cycle[task.status] });
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className={`
      card p-5 hover:shadow-card-hover transition-all duration-300 animate-slide-up group
      ${task.status === 'completed' ? 'opacity-75' : ''}
    `}>
      {/* Top row: status toggle + priority + actions */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Status circle button */}
          <button
            onClick={cycleStatus}
            disabled={statusLoading}
            className={`
              mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all duration-200
              flex items-center justify-center
              ${task.status === 'completed'
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : task.status === 'in-progress'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
              }
            `}
            title="Click to cycle status"
          >
            {task.status === 'completed' && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3">
                <polyline points="20,6 9,17 4,12" />
              </svg>
            )}
            {task.status === 'in-progress' && (
              <div className="w-2 h-2 rounded-full bg-blue-500" />
            )}
          </button>

          {/* Title */}
          <h3 className={`
            text-sm font-semibold text-gray-900 dark:text-white leading-snug
            ${task.status === 'completed' ? 'line-through text-gray-400 dark:text-gray-500' : ''}
          `}>
            {task.title}
          </h3>
        </div>

        {/* Actions (show on hover) */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            title="Edit task"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
            title="Delete task"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <polyline points="3,6 5,6 21,6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 ml-8 mb-3 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Badges row */}
      <div className="flex flex-wrap items-center gap-2 ml-8 mb-3">
        <PriorityBadge priority={task.priority} />
        <StatusBadge status={task.status} />
        {task.category && task.category !== 'General' && (
          <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
            {task.category}
          </span>
        )}
      </div>

      {/* Tags */}
      {task.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 ml-8 mb-3">
          {task.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-md font-medium">
              #{tag}
            </span>
          ))}
          {task.tags.length > 4 && (
            <span className="text-xs text-gray-400">+{task.tags.length - 4} more</span>
          )}
        </div>
      )}

      {/* Footer: due date */}
      {task.dueDate && (
        <div className={`flex items-center gap-1.5 ml-8 text-xs font-medium ${isOverdue ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {isOverdue ? '⚠ Overdue · ' : ''}
          {format(parseISO(task.dueDate), 'MMM d, yyyy')}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
