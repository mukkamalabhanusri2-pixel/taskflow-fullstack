/**
 * ProfilePage - User profile and settings
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { Spinner } from '../components/ui/LoadingScreen';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [profileForm, setProfileForm] = useState({ name: user?.name || '', avatar: user?.avatar || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const handleProfileChange = (e) => {
    setProfileForm(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const { data } = await authAPI.updateProfile(profileForm);
      updateUser(data.user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const validatePassword = () => {
    const errs = {};
    if (!passwordForm.currentPassword) errs.currentPassword = 'Current password is required';
    if (!passwordForm.newPassword) errs.newPassword = 'New password is required';
    else if (passwordForm.newPassword.length < 6) errs.newPassword = 'Must be at least 6 characters';
    if (passwordForm.newPassword !== passwordForm.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setPasswordErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;
    setPasswordLoading(true);
    try {
      await authAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">

      {/* Profile Header Card */}
      <div className="card p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-lg">
            {initials || '?'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="badge bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 capitalize">
                {user?.role}
              </span>
              {user?.createdAt && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  Member since {format(new Date(user.createdAt), 'MMM yyyy')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile */}
      <div className="card p-6">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-indigo-500">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit Profile
        </h3>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input
              name="name"
              value={profileForm.name}
              onChange={handleProfileChange}
              className="input-field"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="label">Email Address</label>
            <input
              value={user?.email || ''}
              disabled
              className="input-field opacity-60 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">Email address cannot be changed.</p>
          </div>
          <button type="submit" disabled={profileLoading} className="btn-primary">
            {profileLoading && <Spinner size="xs" />}
            Save Changes
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="card p-6">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-indigo-500">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          Change Password
        </h3>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {[
            { name: 'currentPassword', label: 'Current Password', placeholder: 'Enter current password' },
            { name: 'newPassword', label: 'New Password', placeholder: 'At least 6 characters' },
            { name: 'confirmPassword', label: 'Confirm New Password', placeholder: 'Repeat new password' },
          ].map(({ name, label, placeholder }) => (
            <div key={name}>
              <label className="label">{label}</label>
              <input
                type="password"
                name={name}
                value={passwordForm[name]}
                onChange={(e) => {
                  setPasswordForm(p => ({ ...p, [name]: e.target.value }));
                  if (passwordErrors[name]) setPasswordErrors(p => ({ ...p, [name]: '' }));
                }}
                placeholder={placeholder}
                className={`input-field ${passwordErrors[name] ? 'border-red-400' : ''}`}
              />
              {passwordErrors[name] && <p className="text-red-500 text-xs mt-1">{passwordErrors[name]}</p>}
            </div>
          ))}
          <button type="submit" disabled={passwordLoading} className="btn-primary">
            {passwordLoading && <Spinner size="xs" />}
            Update Password
          </button>
        </form>
      </div>

      {/* Account Info */}
      <div className="card p-6">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-indigo-500">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          Account Information
        </h3>
        <div className="space-y-3">
          {[
            { label: 'Account ID', value: user?._id },
            { label: 'Role', value: user?.role },
            { label: 'Member Since', value: user?.createdAt ? format(new Date(user.createdAt), 'MMMM d, yyyy') : '-' },
            { label: 'Last Login', value: user?.lastLogin ? format(new Date(user.lastLogin), 'PPpp') : '-' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-[var(--border-color)] last:border-0">
              <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate max-w-xs text-right font-mono text-xs">
                {value || '-'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
