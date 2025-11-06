import { useNavigate } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Simple SVG icons for stats
function FileTextIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function BriefcaseIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function SendIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}

function TrendingUpIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

function PlusIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

const activityData = [
  { name: "Mon", cvs: 2, jobs: 1 },
  { name: "Tue", cvs: 3, jobs: 2 },
  { name: "Wed", cvs: 1, jobs: 1 },
  { name: "Thu", cvs: 4, jobs: 3 },
  { name: "Fri", cvs: 3, jobs: 2 },
  { name: "Sat", cvs: 2, jobs: 1 },
  { name: "Sun", cvs: 1, jobs: 0 },
];

const recentActivities = [
  { action: "Created CV for Senior Developer position", time: "2 hours ago" },
  { action: "Applied to Frontend Engineer at Tech Corp", time: "5 hours ago" },
  { action: "CV downloaded by Startup Inc", time: "1 day ago" },
  { action: "Profile updated with new skills", time: "2 days ago" },
];

function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 dark:text-gray-200 text-gray-900">
              Welcome back, John!
            </h1>
            <p className="text-sm sm:text-base dark:text-gray-400 text-gray-500">
              Here's what's happening with your job search today
            </p>
          </div>
          <button
            onClick={() => navigate('/create-cv')}
            className="px-4 py-2 sm:px-6 sm:py-3 rounded-xl text-white font-medium transition-colors shadow-sm flex items-center justify-center gap-2 whitespace-nowrap"
            style={{ 
              backgroundColor: '#6CA6CD'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(108, 166, 205, 0.9)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#6CA6CD';
            }}
          >
            <PlusIcon className="h-4 w-4" />
            Create New CV
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatsCard
            title="CVs Created"
            value="12"
            icon={FileTextIcon}
            trend="+2 this week"
            trendUp={true}
          />
          <StatsCard
            title="Jobs Applied"
            value="8"
            icon={BriefcaseIcon}
            trend="+3 this week"
            trendUp={true}
          />
          <StatsCard
            title="CVs Sent"
            value="15"
            icon={SendIcon}
            trend="+5 this week"
            trendUp={true}
          />
          <StatsCard
            title="Skill Match"
            value="87%"
            icon={TrendingUpIcon}
            trend="+5% this month"
            trendUp={true}
          />
        </div>

        {/* Charts and Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Activity Chart */}
          <div 
            className="lg:col-span-2 rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)]"
          >
            <div className="p-4 sm:p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-1 dark:text-gray-200 text-gray-900">Weekly Activity</h3>
                <p className="text-sm dark:text-gray-400 text-gray-500">Your CV creation and job application trends</p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(108, 166, 205, 0.1)" />
                  <XAxis
                    dataKey="name"
                    stroke="#9BA3B0"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#9BA3B0" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: document.documentElement.classList.contains('dark') ? "#1A1F2E" : "#ffffff",
                      border: "1px solid rgba(108, 166, 205, 0.15)",
                      borderRadius: "0.75rem",
                      color: document.documentElement.classList.contains('dark') ? "#E5E7EB" : "#1A1A1A",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cvs"
                    stroke="#6CA6CD"
                    strokeWidth={2}
                    dot={{ fill: "#6CA6CD", r: 4 }}
                    name="CVs Created"
                  />
                  <Line
                    type="monotone"
                    dataKey="jobs"
                    stroke="#B2A5FF"
                    strokeWidth={2}
                    dot={{ fill: "#B2A5FF", r: 4 }}
                    name="Jobs Applied"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div 
            className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)]"
          >
            <div className="p-4 sm:p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-1 dark:text-gray-200 text-gray-900">Recent Activity</h3>
                <p className="text-sm dark:text-gray-400 text-gray-500">Your latest actions</p>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex gap-3">
                    <div 
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        background: 'linear-gradient(to bottom right, rgba(108, 166, 205, 0.2), rgba(178, 165, 255, 0.2))'
                      }}
                    >
                      <div 
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: '#6CA6CD' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm dark:text-gray-200 text-gray-900">{activity.action}</p>
                      <p className="text-xs mt-0.5 dark:text-gray-400 text-gray-500">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div 
            className="rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)]"
            onClick={() => navigate('/create-cv')}
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-start gap-4">
                <div 
                  className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(to bottom right, rgba(108, 166, 205, 0.2), rgba(178, 165, 255, 0.2))'
                  }}
                >
                  <FileTextIcon className="h-6 w-6" style={{ color: '#6CA6CD' }} />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold dark:text-gray-200 text-gray-900">Create CV</h3>
                  <p className="text-sm dark:text-gray-400 text-gray-500">
                    Build a tailored CV for your next application
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div 
            className="rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)]"
            onClick={() => navigate('/view-jobs')}
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-start gap-4">
                <div 
                  className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(to bottom right, rgba(108, 166, 205, 0.2), rgba(178, 165, 255, 0.2))'
                  }}
                >
                  <BriefcaseIcon className="h-6 w-6" style={{ color: '#6CA6CD' }} />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold dark:text-gray-200 text-gray-900">Browse Jobs</h3>
                  <p className="text-sm dark:text-gray-400 text-gray-500">
                    Find jobs that match your skills
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div 
            className="rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)]"
            onClick={() => navigate('/profile')}
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-start gap-4">
                <div 
                  className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(to bottom right, rgba(108, 166, 205, 0.2), rgba(178, 165, 255, 0.2))'
                  }}
                >
                  <TrendingUpIcon className="h-6 w-6" style={{ color: '#6CA6CD' }} />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold dark:text-gray-200 text-gray-900">Update Profile</h3>
                  <p className="text-sm dark:text-gray-400 text-gray-500">
                    Keep your information up to date
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default DashboardPage;

