/**
 * TaskFilters - Search and filter bar for tasks
 */

import React from 'react';

const TaskFilters = ({ filters, onFilterChange, onReset }) => {
  const hasActiveFilters = filters.status || filters.priority || filters.category || filters.search;

  return (
    <div className="card p-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <svg
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          >
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="input-field pl-10"
          />
        </div>

        {/* Status filter */}
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value })}
          className="input-field sm:w-36"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {/* Priority filter */}
        <select
          value={filters.priority}
          onChange={(e) => onFilterChange({ priority: e.target.value })}
          className="input-field sm:w-36"
        >
          <option value="">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* Sort */}
        <select
          value={`${filters.sortBy}-${filters.order}`}
          onChange={(e) => {
            const [sortBy, order] = e.target.value.split('-');
            onFilterChange({ sortBy, order });
          }}
          className="input-field sm:w-40"
        >
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="dueDate-asc">Due Date ↑</option>
          <option value="dueDate-desc">Due Date ↓</option>
          <option value="priority-desc">Priority ↓</option>
          <option value="title-asc">Title A-Z</option>
        </select>

        {/* Reset filters */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="btn-ghost border border-[var(--border-color)] px-4 whitespace-nowrap"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskFilters;
