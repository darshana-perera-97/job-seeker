import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

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

function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [jobRecommendations, setJobRecommendations] = useState(true);
  const [applicationUpdates, setApplicationUpdates] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    // Handle password update logic here
    alert('Password updated successfully!');
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

      {/* Security */}
      <div 
        className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)]"
      >
        <div className="p-6 sm:p-8">
          <h3 className="text-lg font-semibold mb-6 dark:text-gray-200 text-gray-900">
            Security
          </h3>
          <form onSubmit={handlePasswordUpdate} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="currentPassword" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
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
                className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-colors"
              style={{ backgroundColor: '#6CA6CD' }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(108, 166, 205, 0.9)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#6CA6CD';
              }}
            >
              Update Password
            </button>
          </form>
        </div>
      </div>

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
                checked={emailNotifications} 
                onChange={() => setEmailNotifications(!emailNotifications)} 
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
                checked={jobRecommendations} 
                onChange={() => setJobRecommendations(!jobRecommendations)} 
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
                checked={applicationUpdates} 
                onChange={() => setApplicationUpdates(!applicationUpdates)} 
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
                checked={marketingEmails} 
                onChange={() => setMarketingEmails(!marketingEmails)} 
              />
            </div>
          </div>
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

