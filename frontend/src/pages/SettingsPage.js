import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import API_BASE_URL from '../utils/apiConfig';

// SVG Icons
function MoonIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}

function SunIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

// Switch Component
function Switch({ checked, onChange, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-offset-2 ${
        checked ? 'bg-[#6CA6CD]' : 'bg-gray-300 dark:bg-gray-600'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

const defaultPreferences = {
  emailNotifications: true,
  jobRecommendations: true,
  applicationUpdates: true,
  marketingEmails: false
};

function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [preferencesLoading, setPreferencesLoading] = useState(true);
  const [preferencesSaving, setPreferencesSaving] = useState(false);
  const [preferencesError, setPreferencesError] = useState('');
  const [preferencesMessage, setPreferencesMessage] = useState('');
  
  // Password change form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Get user data from localStorage
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }, []);

  const handlePasswordChange = (e) => {
    const { id, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [id]: value
    }));
    // Clear errors when user starts typing
    if (passwordError) setPasswordError('');
    if (passwordSuccess) setPasswordSuccess('');
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    setPasswordLoading(true);

    // Validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('All fields are required');
      setPasswordLoading(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      setPasswordLoading(false);
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirm password do not match');
      setPasswordLoading(false);
      return;
    }

    if (passwordForm.newPassword === passwordForm.currentPassword) {
      setPasswordError('New password must be different from current password');
      setPasswordLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      if (data.success) {
        setPasswordSuccess('Password updated successfully!');
        // Update user in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        // Clear form
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setPasswordError(data.error || 'Failed to change password');
      }
    } catch (err) {
      console.error('Password change error:', err);
      setPasswordError(err.message || 'Failed to change password. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleExportData = () => {
    // Handle data export logic here
    alert('Data export started. You will receive an email when it\'s ready.');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Handle account deletion logic here
      alert('Account deletion initiated. Please check your email to confirm.');
    }
  };

  // Fetch preferences when user is available
  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user) {
        return;
      }

      setPreferencesLoading(true);
      setPreferencesError('');

      try {
        const res = await fetch(`${API_BASE_URL}/api/profile/preferences/${user.id}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to load preferences');
        }

        setPreferences({
          ...defaultPreferences,
          ...data.preferences
        });
      } catch (error) {
        console.error('Fetch preferences error:', error);
        setPreferencesError(error.message || 'Failed to load preferences. Using defaults.');
        setPreferences(defaultPreferences);
      } finally {
        setPreferencesLoading(false);
      }
    };

    fetchPreferences();
  }, [user]);

  const savePreferences = async (updatedPreferences) => {
    if (!user) return;

    setPreferencesSaving(true);
    setPreferencesError('');
    setPreferencesMessage('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/profile/preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          preferences: updatedPreferences
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save preferences');
      }

      setPreferences({
        ...defaultPreferences,
        ...data.preferences
      });
      setPreferencesMessage('Preferences saved');
      setTimeout(() => {
        setPreferencesMessage('');
      }, 2000);
    } catch (error) {
      console.error('Save preferences error:', error);
      setPreferencesError(error.message || 'Failed to save preferences. Please try again.');
    } finally {
      setPreferencesSaving(false);
    }
  };

  const togglePreference = (key) => {
    const updated = {
      ...preferences,
      [key]: !preferences[key]
    };
    setPreferences(updated);
    savePreferences(updated);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 dark:text-gray-200 text-gray-900">
          Settings
        </h1>
        <p className="text-sm sm:text-base dark:text-gray-400 text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Appearance */}
      <div 
        className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)]"
      >
        <div className="p-6 sm:p-8">
          <h3 className="text-lg font-semibold mb-6 dark:text-gray-200 text-gray-900">
            Appearance
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1 flex-1 pr-4">
                <label className="text-sm font-medium dark:text-gray-200 text-gray-900">
                  Dark Mode
                </label>
                <p className="text-sm dark:text-gray-400 text-gray-500">
                  Toggle between light and dark theme
                </p>
              </div>
              <Switch checked={theme === 'dark'} onChange={toggleTheme} />
            </div>
          </div>
        </div>
      </div>

      {/* Security - Only show for email-based users */}
      {user && user.authProvider === 'email' && (
        <div 
          className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)]"
        >
          <div className="p-6 sm:p-8">
            <h3 className="text-lg font-semibold mb-6 dark:text-gray-200 text-gray-900">
              Security
            </h3>
            <form onSubmit={handlePasswordUpdate} className="space-y-5">
              {/* Error Message */}
              {passwordError && (
                <div className="rounded-xl p-3 text-sm" style={{ 
                  backgroundColor: '#FEE2E2',
                  color: '#DC2626',
                  border: '1px solid #FCA5A5'
                }}>
                  {passwordError}
                </div>
              )}

              {/* Success Message */}
              {passwordSuccess && (
                <div className="rounded-xl p-3 text-sm" style={{ 
                  backgroundColor: '#D1FAE5',
                  color: '#065F46',
                  border: '1px solid #6EE7B7'
                }}>
                  {passwordSuccess}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="currentPassword" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  placeholder="••••••••"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  disabled={passwordLoading}
                  className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                  disabled={passwordLoading}
                  minLength={6}
                  className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p className="text-xs dark:text-gray-400 text-gray-500">
                  Password must be at least 6 characters long
                </p>
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  disabled={passwordLoading}
                  className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <button
                type="submit"
                disabled={passwordLoading}
                className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: passwordLoading ? 'rgba(108, 166, 205, 0.7)' : '#6CA6CD' }}
                onMouseEnter={(e) => {
                  if (!passwordLoading) {
                    e.target.style.backgroundColor = 'rgba(108, 166, 205, 0.9)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!passwordLoading) {
                    e.target.style.backgroundColor = '#6CA6CD';
                  }
                }}
              >
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Notifications */}
      <div 
        className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)]"
      >
        <div className="p-6 sm:p-8">
          <h3 className="text-lg font-semibold mb-6 dark:text-gray-200 text-gray-900">
            Notification Preferences
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1 flex-1 pr-4">
                <label className="text-sm font-medium dark:text-gray-200 text-gray-900">
                  Email Notifications
                </label>
                <p className="text-sm dark:text-gray-400 text-gray-500">
                  Receive email updates about your applications
                </p>
              </div>
              <Switch 
                checked={preferences.emailNotifications} 
                onChange={() => togglePreference('emailNotifications')}
                disabled={preferencesLoading || preferencesSaving}
              />
            </div>
            <div className="h-px dark:bg-[rgba(108,166,205,0.25)] bg-[rgba(108,166,205,0.15)]" />
            <div className="flex items-center justify-between">
              <div className="space-y-1 flex-1 pr-4">
                <label className="text-sm font-medium dark:text-gray-200 text-gray-900">
                  Job Recommendations
                </label>
                <p className="text-sm dark:text-gray-400 text-gray-500">
                  Get notified about jobs matching your profile
                </p>
              </div>
              <Switch 
                checked={preferences.jobRecommendations} 
                onChange={() => togglePreference('jobRecommendations')}
                disabled={preferencesLoading || preferencesSaving}
              />
            </div>
            <div className="h-px dark:bg-[rgba(108,166,205,0.25)] bg-[rgba(108,166,205,0.15)]" />
            <div className="flex items-center justify-between">
              <div className="space-y-1 flex-1 pr-4">
                <label className="text-sm font-medium dark:text-gray-200 text-gray-900">
                  Application Updates
                </label>
                <p className="text-sm dark:text-gray-400 text-gray-500">
                  Receive updates when companies review your CV
                </p>
              </div>
              <Switch 
                checked={preferences.applicationUpdates} 
                onChange={() => togglePreference('applicationUpdates')}
                disabled={preferencesLoading || preferencesSaving}
              />
            </div>
            <div className="h-px dark:bg-[rgba(108,166,205,0.25)] bg-[rgba(108,166,205,0.15)]" />
            <div className="flex items-center justify-between">
              <div className="space-y-1 flex-1 pr-4">
                <label className="text-sm font-medium dark:text-gray-200 text-gray-900">
                  Marketing Emails
                </label>
                <p className="text-sm dark:text-gray-400 text-gray-500">
                  Receive tips and news about job hunting
                </p>
              </div>
              <Switch 
                checked={preferences.marketingEmails} 
                onChange={() => togglePreference('marketingEmails')}
                disabled={preferencesLoading || preferencesSaving}
              />
            </div>
          </div>
          {(preferencesError || preferencesMessage) && (
            <div className="mt-4">
              {preferencesError && (
                <div className="rounded-xl p-3 text-sm" style={{ 
                  backgroundColor: '#FEE2E2',
                  color: '#DC2626',
                  border: '1px solid #FCA5A5'
                }}>
                  {preferencesError}
                </div>
              )}
              {preferencesMessage && (
                <div className="rounded-xl p-3 text-sm" style={{ 
                  backgroundColor: '#D1FAE5',
                  color: '#065F46',
                  border: '1px solid #6EE7B7'
                }}>
                  {preferencesMessage}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Account Management */}
      <div 
        className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)]"
      >
        <div className="p-6 sm:p-8">
          <h3 className="text-lg font-semibold mb-6 dark:text-gray-200 text-gray-900">
            Account Management
          </h3>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block dark:text-gray-200 text-gray-900">
                Export Data
              </label>
              <p className="text-sm dark:text-gray-400 text-gray-500 mb-4">
                Download all your CVs and application data
              </p>
              <button
                onClick={handleExportData}
                className="px-6 py-2.5 rounded-xl text-sm font-medium border transition-colors dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 hover:bg-gray-50 dark:hover:bg-[rgba(108,166,205,0.1)]"
              >
                Export My Data
              </button>
            </div>
            <div className="h-px dark:bg-[rgba(108,166,205,0.25)] bg-[rgba(108,166,205,0.15)]" />
            <div>
              <label className="text-sm font-medium mb-2 block dark:text-red-400 text-red-600" style={{ color: '#D4183D' }}>
                Delete Account
              </label>
              <p className="text-sm dark:text-gray-400 text-gray-500 mb-4">
                Permanently delete your account and all associated data
              </p>
              <button
                onClick={handleDeleteAccount}
                className="px-6 py-2.5 rounded-xl text-sm font-medium border transition-colors dark:border-red-600 border-red-600 dark:text-red-400 text-red-600 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white"
              >
                Delete My Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;

