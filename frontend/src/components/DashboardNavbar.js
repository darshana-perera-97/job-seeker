import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from './SidebarProvider';
import { useTheme } from '../contexts/ThemeContext';

function PanelLeftIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function BellIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

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

function FileTextIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function UserIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function LogOutIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

function SettingsIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function DashboardNavbar() {
  const { toggleSidebar, isMobile } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userPopupOpen, setUserPopupOpen] = useState(false);
  const userPopupRef = useRef(null);
  
  // Get user data from localStorage
  const getUserData = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    return null;
  };

  const user = getUserData();

  // Get first letter of full name
  const getFirstLetter = () => {
    if (!user) return 'U';
    if (user.fullName) {
      const trimmedName = user.fullName.trim();
      return trimmedName[0]?.toUpperCase() || 'U';
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    setUserPopupOpen(false);
    navigate('/login');
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userPopupRef.current && !userPopupRef.current.contains(event.target)) {
        setUserPopupOpen(false);
      }
    };

    if (userPopupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userPopupOpen]);

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b backdrop-blur-sm dark:bg-[#1A1F2E] bg-white dark:border-[rgba(108,166,205,0.25)] border-[rgba(108,166,205,0.15)] transition-colors"
    >
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-primary/10 dark:hover:bg-[rgba(108,166,205,0.15)] transition-colors dark:text-gray-200 text-gray-900"
          >
            <PanelLeftIcon className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{
                background: 'linear-gradient(to bottom right, #6CA6CD, #B2A5FF)'
              }}
            >
              <FileTextIcon className="h-5 w-5 text-white" />
            </div>
            <h1 className="font-semibold hidden sm:block dark:text-gray-100 text-gray-900">
              CV Creator
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-primary/10 dark:hover:bg-[rgba(108,166,205,0.15)] transition-colors dark:text-gray-200 text-gray-900"
          >
            {theme === 'light' ? (
              <MoonIcon className="h-5 w-5" />
            ) : (
              <SunIcon className="h-5 w-5" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-full hover:bg-primary/10 dark:hover:bg-[rgba(108,166,205,0.15)] transition-colors relative dark:text-gray-200 text-gray-900"
            >
              <BellIcon className="h-5 w-5" />
              <span
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full text-white text-xs font-medium"
                style={{ backgroundColor: '#B2A5FF' }}
              >
                3
              </span>
            </button>
          </div>

          {/* Profile Avatar with Popup */}
          <div className="relative" ref={userPopupRef}>
            <button
              onClick={() => setUserPopupOpen(!userPopupOpen)}
              className="h-10 w-10 rounded-full border-2 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity dark:border-[rgba(108,166,205,0.3)] focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
              style={{
                borderColor: 'rgba(108, 166, 205, 0.2)',
                background: user?.profilePicture 
                  ? `url(${user.profilePicture})` 
                  : 'linear-gradient(to bottom right, #6CA6CD, #B2A5FF)',
                backgroundSize: user?.profilePicture ? 'cover' : 'auto',
                backgroundPosition: 'center'
              }}
            >
              {!user?.profilePicture && (
                <span className="text-white text-sm font-medium">{getFirstLetter()}</span>
              )}
            </button>

            {/* User Popup */}
            {userPopupOpen && (
              <div
                className="absolute right-0 mt-2 w-72 rounded-xl shadow-lg border z-50 dark:bg-[#1A1F2E] bg-white dark:border-[rgba(108,166,205,0.25)] border-[rgba(108,166,205,0.15)] overflow-hidden"
                style={{
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                }}
              >
                {/* User Info Section */}
                <div className="p-4 border-b dark:border-[rgba(108,166,205,0.25)] border-[rgba(108,166,205,0.15)]">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-12 w-12 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      style={{
                        borderColor: 'rgba(108, 166, 205, 0.2)',
                        background: user?.profilePicture 
                          ? `url(${user.profilePicture})` 
                          : 'linear-gradient(to bottom right, #6CA6CD, #B2A5FF)',
                        backgroundSize: user?.profilePicture ? 'cover' : 'auto',
                        backgroundPosition: 'center'
                      }}
                    >
                      {!user?.profilePicture && (
                        <span className="text-white text-base font-medium">{getFirstLetter()}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate dark:text-gray-100 text-gray-900">
                        {user?.fullName || user?.email || 'User'}
                      </p>
                      {user?.email && (
                        <p className="text-xs truncate dark:text-gray-400 text-gray-500 mt-0.5">
                          {user.email}
                        </p>
                      )}
                      {user?.authProvider && (
                        <p className="text-xs mt-1">
                          <span 
                            className="px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: 'rgba(108, 166, 205, 0.1)',
                              color: '#6CA6CD'
                            }}
                          >
                            {user.authProvider === 'google' ? 'Google Account' : 'Email Account'}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  <button
                    onClick={() => {
                      setUserPopupOpen(false);
                      navigate('/profile');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors dark:text-gray-200 text-gray-900 hover:bg-gray-50 dark:hover:bg-[rgba(108,166,205,0.1)]"
                  >
                    <UserIcon className="h-4 w-4" style={{ color: '#6CA6CD' }} />
                    <span>View Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setUserPopupOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors dark:text-gray-200 text-gray-900 hover:bg-gray-50 dark:hover:bg-[rgba(108,166,205,0.1)]"
                  >
                    <SettingsIcon className="h-4 w-4" style={{ color: '#6CA6CD' }} />
                    <span>Settings</span>
                  </button>
                </div>

                {/* Logout Button */}
                <div className="p-2 border-t dark:border-[rgba(108,166,205,0.25)] border-[rgba(108,166,205,0.15)]">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOutIcon className="h-4 w-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default DashboardNavbar;

