import { useState } from 'react';
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

function DashboardNavbar() {
  const { toggleSidebar, isMobile } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

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

          {/* Profile Avatar */}
          <div
            className="h-10 w-10 rounded-full border-2 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity dark:border-[rgba(108,166,205,0.3)]"
            style={{
              borderColor: 'rgba(108, 166, 205, 0.2)',
              background: 'linear-gradient(to bottom right, #6CA6CD, #B2A5FF)'
            }}
          >
            <span className="text-white text-sm font-medium">JD</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default DashboardNavbar;

