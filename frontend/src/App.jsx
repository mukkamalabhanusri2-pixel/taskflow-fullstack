/**
 * App.jsx - Main Application Component
 * Sets up routing, auth protection, and global providers
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import ProfilePage from './pages/ProfilePage';

// Layout
import AppLayout from './components/layout/AppLayout';

// Loading spinner for auth check
import LoadingScreen from './components/ui/LoadingScreen';

// ============================================================
// Protected Route - Redirects to login if not authenticated
// ============================================================
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? children : <Navigate to="/login" replace />;
};

// ============================================================
// Public Route - Redirects to dashboard if already logged in
// ============================================================
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return !user ? children : <Navigate to="/dashboard" replace />;
};

// ============================================================
// App Routes
// ============================================================
const AppRoutes = () => (
  <Routes>
    {/* Public Auth Routes */}
    <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

    {/* Protected App Routes (wrapped in layout) */}
    <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
      <Route index element={<Navigate to="/dashboard" replace />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="tasks" element={<TasksPage />} />
      <Route path="profile" element={<ProfilePage />} />
    </Route>

    {/* Catch-all */}
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

// ============================================================
// Root App Component
// ============================================================
const App = () => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              fontSize: '14px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default App;
