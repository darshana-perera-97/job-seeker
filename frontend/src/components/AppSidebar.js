import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from './SidebarProvider';
import { useTheme } from '../contexts/ThemeContext';

// SVG Icons
function LayoutDashboardIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function PlusCircleIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    </svg>
  );
}

function SearchIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function CheckSquareIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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

function SettingsIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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

function FileTextIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function SparklesIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function ChevronLeftIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

const mainMenuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboardIcon,
    path: "/dashboard",
    badge: null,
  },
  {
    title: "Create CV",
    icon: PlusCircleIcon,
    path: "/create-cv",
    badge: "New",
  },
  {
    title: "My CVs",
    icon: FileTextIcon,
    path: "/my-cvs",
    badge: null,
  },
];

const jobMenuItems = [
  {
    title: "Browse Jobs",
    icon: SearchIcon,
    path: "/view-jobs",
    badge: "42",
  },
  {
    title: "Applied Jobs",
    icon: CheckSquareIcon,
    path: "/applied-jobs",
    badge: null,
  },
];

const accountMenuItems = [
  {
    title: "My Profile",
    icon: UserIcon,
    path: "/profile",
    badge: null,
  },
  {
    title: "Settings",
    icon: SettingsIcon,
    path: "/settings",
    badge: null,
  },
];

function MenuItem({ item, isActive, onNavigate, isCollapsed }) {
  const Icon = item.icon;
  return (
    <li>
      <Link
        to={item.path}
        className={`relative flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} h-10 rounded-lg ${isCollapsed ? 'px-2' : 'px-3'} transition-all duration-200 ${
          isActive
            ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-primary dark:from-primary/25 dark:to-secondary/25'
            : 'hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 dark:hover:from-primary/15 dark:hover:to-secondary/15 dark:text-gray-300 text-gray-900'
        }`}
        style={{
          color: isActive ? '#6CA6CD' : undefined
        }}
        onClick={onNavigate}
        title={isCollapsed ? item.title : ''}
      >
        <Icon className="h-4 w-4 shrink-0" style={{ strokeWidth: 2 }} />
        {!isCollapsed && (
          <>
            <span className="font-medium truncate flex-1">{item.title}</span>
            {item.badge && (
              <span
                className="ml-auto shrink-0 text-white text-xs px-1.5 py-0.5 rounded"
                style={{
                  background: item.path === "/create-cv"
                    ? 'linear-gradient(to right, #6CA6CD, #B2A5FF)'
                    : 'rgba(108, 166, 205, 0.3)',
                  color: item.path === "/create-cv" ? '#ffffff' : '#6CA6CD'
                }}
              >
                {item.badge}
              </span>
            )}
          </>
        )}
        {isActive && !isCollapsed && (
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full"
            style={{
              background: 'linear-gradient(to bottom, #6CA6CD, #B2A5FF)'
            }}
          />
        )}
        {isActive && isCollapsed && (
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full"
            style={{
              background: 'linear-gradient(to bottom, #6CA6CD, #B2A5FF)'
            }}
          />
        )}
      </Link>
    </li>
  );
}

function AppSidebar({ isMobile, isOpen, onClose }) {
  const location = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === 'collapsed' && !isMobile;

  const currentPath = location.pathname;

  const handleMenuClick = () => {
    if (isMobile) {
      onClose();
    }
  };

  const handleToggle = () => {
    if (!isMobile) {
      toggleSidebar();
    }
  };

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="border-b p-3 shrink-0 dark:border-[rgba(108,166,205,0.25)] dark:bg-[#1A1F2E] bg-white border-[rgba(108,166,205,0.15)]">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'} min-w-0`}>
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-md"
            style={{
              background: 'linear-gradient(to bottom right, #6CA6CD, #B2A5FF)',
              boxShadow: '0 4px 6px rgba(108, 166, 205, 0.2)'
            }}
          >
            <FileTextIcon className="h-4 w-4 text-white" style={{ strokeWidth: 2.5 }} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 overflow-hidden">
              <span className="font-semibold text-sm truncate dark:text-gray-100 text-gray-900">
                CV Creator
              </span>
              <span className="text-xs truncate dark:text-gray-400 text-gray-500">
                Professional
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={`${isCollapsed ? 'px-2' : 'px-2'} py-3 overflow-x-hidden flex-1 overflow-y-hidden min-h-0`}>
        {/* Main Menu */}
        <div className="mb-3">
          {!isCollapsed && (
            <div className="px-1.5 text-xs uppercase tracking-wider mb-1 dark:text-gray-500 text-gray-500">
              Main Menu
            </div>
          )}
          <ul className="space-y-0.5">
            {mainMenuItems.map((item) => (
              <MenuItem
                key={item.path}
                item={item}
                isActive={currentPath === item.path}
                onNavigate={handleMenuClick}
                isCollapsed={isCollapsed}
              />
            ))}
          </ul>
        </div>

        {/* Separator */}
        {!isCollapsed && (
          <div className="my-3 mx-1 h-px dark:bg-[rgba(108,166,205,0.25)] bg-[rgba(108,166,205,0.15)]" />
        )}

        {/* Jobs Menu */}
        <div className="mb-3">
          {!isCollapsed && (
            <div className="px-1.5 text-xs uppercase tracking-wider mb-1 dark:text-gray-500 text-gray-500">
              Job Search
            </div>
          )}
          <ul className="space-y-0.5">
            {jobMenuItems.map((item) => (
              <MenuItem
                key={item.path}
                item={item}
                isActive={currentPath === item.path}
                onNavigate={handleMenuClick}
                isCollapsed={isCollapsed}
              />
            ))}
          </ul>
        </div>

        {/* Separator */}
        {!isCollapsed && (
          <div className="my-3 mx-1 h-px dark:bg-[rgba(108,166,205,0.25)] bg-[rgba(108,166,205,0.15)]" />
        )}

        {/* Account Menu */}
        <div>
          {!isCollapsed && (
            <div className="px-1.5 text-xs uppercase tracking-wider mb-1 dark:text-gray-500 text-gray-500">
              Account
            </div>
          )}
          <ul className="space-y-0.5">
            {accountMenuItems.map((item) => (
              <MenuItem
                key={item.path}
                item={item}
                isActive={currentPath === item.path}
                onNavigate={handleMenuClick}
                isCollapsed={isCollapsed}
              />
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t p-2 shrink-0 overflow-x-hidden dark:border-[rgba(108,166,205,0.25)] dark:bg-[#1A1F2E] bg-white border-[rgba(108,166,205,0.15)]">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'} rounded-lg p-2.5 mb-2 min-w-0 dark:bg-[rgba(108,166,205,0.08)] bg-[rgba(108,166,205,0.05)]`}
        >
          <div
            className="h-9 w-9 shrink-0 rounded-full border-2 flex items-center justify-center"
            style={{
              borderColor: 'rgba(108, 166, 205, 0.3)',
              background: 'linear-gradient(to bottom right, #6CA6CD, #B2A5FF)'
            }}
          >
            <span className="text-white text-sm font-medium">JD</span>
          </div>
          {!isCollapsed && (
            <>
              <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate dark:text-gray-100 text-gray-900">John Doe</p>
                <p className="text-xs truncate dark:text-gray-400 text-gray-500">Premium Plan</p>
              </div>
              <SparklesIcon className="h-3.5 w-3.5 shrink-0" style={{ color: '#6CA6CD' }} />
            </>
          )}
        </div>

        <Link
          to="/login"
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} h-10 rounded-lg ${isCollapsed ? 'px-2' : 'px-3'} transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400 mb-2`}
          style={{ color: '#D4183D' }}
          onClick={handleMenuClick}
          title={isCollapsed ? 'Log Out' : ''}
        >
          <LogOutIcon className="h-4 w-4 shrink-0" style={{ strokeWidth: 2 }} />
          {!isCollapsed && <span className="font-medium truncate">Log Out</span>}
        </Link>

        {/* Collapse/Expand Toggle Button */}
        {!isMobile && (
          <button
            onClick={handleToggle}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} h-10 rounded-lg ${isCollapsed ? 'px-2' : 'px-3'} transition-all duration-200 w-full dark:text-gray-300 dark:hover:bg-[rgba(108,166,205,0.15)]`}
            style={{ 
              color: '#6CA6CD'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(108, 166, 205, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-4 w-4 shrink-0" style={{ strokeWidth: 2 }} />
            ) : (
              <>
                <ChevronLeftIcon className="h-4 w-4 shrink-0" style={{ strokeWidth: 2 }} />
                <span className="font-medium truncate dark:text-gray-300">Collapse</span>
              </>
            )}
          </button>
        )}
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onClose}
          />
        )}
        {/* Mobile Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full w-64 z-50 transition-transform duration-200 md:hidden overflow-hidden ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          } dark:bg-[#1A1F2E] bg-white`}
        >
          <div className="flex flex-col h-full min-h-0 overflow-hidden dark:bg-[#1A1F2E] bg-white">
            {sidebarContent}
          </div>
        </div>
      </>
    );
  }

  return (
    <div
      className={`hidden md:flex flex-col fixed left-0 top-0 h-screen border-r flex-shrink-0 transition-all duration-200 dark:bg-[#1A1F2E] bg-white dark:border-[rgba(108,166,205,0.25)] border-[rgba(108,166,205,0.15)] overflow-hidden z-40 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full min-h-0 overflow-hidden">
        {sidebarContent}
      </div>
    </div>
  );
}

export default AppSidebar;

