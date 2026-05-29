/**
 * Header - Top navigation bar with search and theme toggle
 */

import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const pageTitles = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Welcome back! Here\'s your overview.' },
  '/tasks': { title: 'My Tasks', subtitle: 'Manage and track all your tasks.' },
  '/profile': { title: 'Profile', subtitle: 'Manage your account settings.' },
};

const Header = ({ onMenuClick }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const location = useLocation();

  const pageInfo = pageTitles[location.pathname] || { title: 'TaskFlow', subtitle: '' };

  // Get today's greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <header className="sticky top-0 z-20 bg-[var(--bg-card)]/80 backdrop-blur-md border-b border-[var(--border-color)] px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Hamburger + Page title */}
        <div className="flex items-center gap-4">
          {/* Mobile hamburger */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Open menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-600 dark:text-gray-400">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div>
            {location.pathname === '/dashboard' ? (
              <>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  {greeting}, {user?.name?.split(' ')[0]}! 👋
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </>
            ) : (
              <>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">{pageInfo.title}</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">{pageInfo.subtitle}</p>
              </>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-amber-500">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-indigo-500">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
