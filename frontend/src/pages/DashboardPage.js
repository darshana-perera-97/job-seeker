import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import WelcomePopup from '../components/WelcomePopup';
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

const defaultWeeklyActivity = [
  { name: 'Mon', cvs: 2, jobs: 1 },
  { name: 'Tue', cvs: 3, jobs: 2 },
  { name: 'Wed', cvs: 1, jobs: 1 },
  { name: 'Thu', cvs: 4, jobs: 3 },
  { name: 'Fri', cvs: 0, jobs: 0 },
  { name: 'Sat', cvs: 2, jobs: 1 },
  { name: 'Sun', cvs: 1, jobs: 5 }
];

const recentJobsSeed = [
  {
    id: 'job-1',
    title: 'Senior Developer',
    company: 'TechCorp',
    appliedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'job-2',
    title: 'Frontend Engineer',
    company: 'Startup Inc',
    appliedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'job-3',
    title: 'UI/UX Designer',
    company: 'Creative Studio',
    appliedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'job-4',
    title: 'Product Manager',
    company: 'Innovate Labs',
    appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

let apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
apiBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
const API_BASE_URL = apiBaseUrl;

const defaultAnalytics = {
  cvsCreated: {
    value: '12',
    trend: 2,
    trendUp: true
  },
  jobsApplied: {
    value: '8',
    trend: 3,
    trendUp: true
  },
  cvsSent: {
    value: '15',
    trend: 5,
    trendUp: true
  },
  skillMatch: {
    value: '87%',
    trend: 5,
    trendUp: true
  }
};

function normalizeAnalytics(analytics) {
  return Object.keys(defaultAnalytics).reduce((acc, key) => {
    const defaultEntry = defaultAnalytics[key];
    const source = analytics && analytics[key] ? analytics[key] : {};
    const sourceTrend = source.trend;
    let numericTrend = defaultEntry.trend;

    if (sourceTrend !== undefined && sourceTrend !== null) {
      const trendMatch = String(sourceTrend).match(/-?\d+(?:\.\d+)?/);
      if (trendMatch) {
        const parsedTrend = Number(trendMatch[0]);
        if (!Number.isNaN(parsedTrend)) {
          numericTrend = Math.abs(parsedTrend);
        }
      }
    }

    acc[key] = {
      value: source.value !== undefined && source.value !== null
        ? String(source.value)
        : defaultEntry.value,
      trend: numericTrend,
      trendUp: typeof source.trendUp === 'boolean'
        ? source.trendUp
        : defaultEntry.trendUp
    };

    return acc;
  }, {});
}

const trendSuffixMap = {
  cvsCreated: ' this week',
  jobsApplied: ' this week',
  cvsSent: ' this week',
  skillMatch: '% this month'
};

function getTrendText(key, entry) {
  if (!entry || entry.trend === undefined || entry.trend === null) {
    return '';
  }

  const numericTrend = Number(entry.trend);
  if (Number.isNaN(numericTrend)) {
    return '';
  }

  const sign = entry.trendUp ? '+' : '-';
  const suffix = trendSuffixMap[key] ?? '';
  const magnitude = Math.abs(numericTrend);

  return `${sign}${magnitude}${suffix}`;
}

function normalizeWeeklyActivity(activity) {
  const sanitized = Array.isArray(activity) ? activity : [];
  const usedKeys = new Set();

  const normalized = defaultWeeklyActivity.map((day) => {
    const match = sanitized.find((item) =>
      item && typeof item === 'object' && item.name && item.name.toLowerCase() === day.name.toLowerCase()
    );

    if (match?.name) {
      usedKeys.add(match.name.toLowerCase());
    }

    const cvsValue = match?.cvs !== undefined && match?.cvs !== null && !Number.isNaN(Number(match.cvs))
      ? Number(match.cvs)
      : day.cvs;

    const jobsValue = match?.jobs !== undefined && match?.jobs !== null && !Number.isNaN(Number(match.jobs))
      ? Number(match.jobs)
      : day.jobs;

    return {
      name: match?.name || day.name,
      cvs: cvsValue,
      jobs: jobsValue
    };
  });

  const extraEntries = sanitized
    .filter((item) => item && typeof item === 'object' && item.name && !usedKeys.has(item.name.toLowerCase()))
    .map((item) => {
      const name = String(item.name).trim();
      const cvsValue = item.cvs !== undefined && item.cvs !== null && !Number.isNaN(Number(item.cvs))
        ? Number(item.cvs)
        : 0;
      const jobsValue = item.jobs !== undefined && item.jobs !== null && !Number.isNaN(Number(item.jobs))
        ? Number(item.jobs)
        : 0;

      return {
        name: name.length > 0 ? name : 'Day',
        cvs: cvsValue,
        jobs: jobsValue
      };
    });

  return [...normalized, ...extraEntries];
}

function normalizeRecentJobs(jobs) {
  if (!Array.isArray(jobs)) {
    return recentJobsSeed;
  }

  return jobs
    .map((job, index) => {
      if (!job || typeof job !== 'object') {
        return null;
      }

      const id = job.id ? String(job.id).trim() : `job-${index}`;
      const title = job.title ? String(job.title).trim() : '';
      const company = job.company ? String(job.company).trim() : '';
      const appliedAtDate = job.appliedAt ? new Date(job.appliedAt) : null;
      const appliedAt = appliedAtDate && !Number.isNaN(appliedAtDate.getTime())
        ? appliedAtDate.toISOString()
        : new Date().toISOString();

      if (!title || !company) {
        return null;
      }

      return {
        id,
        title,
        company,
        appliedAt
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
}

function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) {
    return `${seconds}s ago`;
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days}d ago`;
  }
  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return `${weeks}w ago`;
  }
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months}mo ago`;
  }
  const years = Math.floor(days / 365);
  return `${years}y ago`;
}

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState(defaultAnalytics);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState('');
  const [weeklyActivity, setWeeklyActivity] = useState(defaultWeeklyActivity);
  const [weeklyActivityLoading, setWeeklyActivityLoading] = useState(true);
  const [weeklyActivityError, setWeeklyActivityError] = useState('');
  const [recentJobs, setRecentJobs] = useState(recentJobsSeed);
  const [recentJobsLoading, setRecentJobsLoading] = useState(true);
  const [recentJobsError, setRecentJobsError] = useState('');
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
        
        // Check if we should show welcome popup (set during signup)
        const userId = userData.id;
        const shouldShowPopup = localStorage.getItem(`showWelcomePopup_${userId}`);
        const hasSeenWelcomePopup = localStorage.getItem(`hasSeenWelcomePopup_${userId}`);
        
        // Show popup if flag is set (new signup) or if user hasn't seen it yet
        if (shouldShowPopup === 'true' || !hasSeenWelcomePopup) {
          setShowWelcomePopup(true);
          // Clear the show flag once we've decided to show it
          if (shouldShowPopup === 'true') {
            localStorage.removeItem(`showWelcomePopup_${userId}`);
          }
        }
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }, []);

  useEffect(() => {
    if (user?.recentJobs) {
      const normalized = normalizeRecentJobs(user.recentJobs);
      setRecentJobs(normalized);
      setRecentJobsLoading(false);
    }
  }, [user?.recentJobs]);

  const userId = user?.id;

  const updateCachedUserAnalytics = (nextAnalytics) => {
    setUser((prev) => {
      if (!prev) return prev;
      const prevAnalytics = prev.analytics || {};
      if (JSON.stringify(prevAnalytics) === JSON.stringify(nextAnalytics)) {
        return prev;
      }
      const updatedUser = { ...prev, analytics: nextAnalytics };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const updateCachedWeeklyActivity = (nextActivity) => {
    setUser((prev) => {
      if (!prev) return prev;
      const prevActivity = prev.weeklyActivity || [];
      if (JSON.stringify(prevActivity) === JSON.stringify(nextActivity)) {
        return prev;
      }
      const updatedUser = { ...prev, weeklyActivity: nextActivity };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const updateCachedRecentJobs = (nextJobs) => {
    setUser((prev) => {
      if (!prev) return prev;
      const prevJobs = prev.recentJobs || [];
      if (JSON.stringify(prevJobs) === JSON.stringify(nextJobs)) {
        return prev;
      }
      const updatedUser = { ...prev, recentJobs: nextJobs };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const saveAnalytics = async (nextAnalytics, { silent = false, updateState = true } = {}) => {
    if (!userId) return false;

    try {
      const res = await fetch(`${API_BASE_URL}/api/profile/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          analytics: nextAnalytics
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update analytics');
      }

      const normalized = normalizeAnalytics(data.analytics);

      if (updateState) {
        setAnalytics(normalized);
      }
      updateCachedUserAnalytics(normalized);

      return true;
    } catch (error) {
      console.error('Save analytics error:', error);
      if (!silent) {
        setAnalyticsError(error.message || 'Failed to update analytics.');
      }
      return false;
    }
  };

  const saveWeeklyActivity = async (nextActivity, { silent = false, updateState = true } = {}) => {
    if (!userId) return false;

    try {
      const res = await fetch(`${API_BASE_URL}/api/profile/activity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          weeklyActivity: nextActivity
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update weekly activity');
      }

      const normalized = normalizeWeeklyActivity(data.weeklyActivity);

      if (updateState) {
        setWeeklyActivity(normalized);
      }
      updateCachedWeeklyActivity(normalized);

      return true;
    } catch (error) {
      console.error('Save weekly activity error:', error);
      if (!silent) {
        setWeeklyActivityError(error.message || 'Failed to update weekly activity.');
      }
      return false;
    }
  };

  const saveRecentJobs = async (nextJobs, { silent = false, updateState = true } = {}) => {
    if (!userId) return false;

    try {
      const res = await fetch(`${API_BASE_URL}/api/profile/recent-jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          recentJobs: nextJobs
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update recent jobs');
      }

      const normalized = normalizeRecentJobs(data.recentJobs);

      if (updateState) {
        setRecentJobs(normalized);
      }
      updateCachedRecentJobs(normalized);

      return true;
    } catch (error) {
      console.error('Save recent jobs error:', error);
      if (!silent) {
        setRecentJobsError(error.message || 'Failed to update recent jobs.');
      }
      return false;
    }
  };

  useEffect(() => {
    if (!userId) {
      setAnalyticsLoading(false);
      setWeeklyActivityLoading(false);
      setRecentJobs(recentJobsSeed);
      setRecentJobsLoading(false);
      return;
    }

    let isMounted = true;

    const fetchAnalytics = async () => {
      setAnalyticsLoading(true);
      setAnalyticsError('');

      try {
        const res = await fetch(`${API_BASE_URL}/api/profile/analytics/${userId}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to load analytics');
        }

        const normalized = normalizeAnalytics(data.analytics);

        if (!isMounted) return;

        setAnalytics(normalized);
        updateCachedUserAnalytics(normalized);

        if (data.isDefault) {
          await saveAnalytics(normalized, { silent: true, updateState: false });
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Fetch analytics error:', error);
        setAnalyticsError(error.message || 'Failed to load analytics. Showing defaults.');
        setAnalytics(defaultAnalytics);
      } finally {
        if (isMounted) {
          setAnalyticsLoading(false);
        }
      }
    };

    const fetchWeeklyActivity = async () => {
      setWeeklyActivityLoading(true);
      setWeeklyActivityError('');

      try {
        const res = await fetch(`${API_BASE_URL}/api/profile/activity/${userId}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to load weekly activity');
        }

        const normalized = normalizeWeeklyActivity(data.weeklyActivity);

        if (!isMounted) return;

        setWeeklyActivity(normalized);
        updateCachedWeeklyActivity(normalized);

        if (data.isDefault) {
          await saveWeeklyActivity(normalized, { silent: true, updateState: false });
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Fetch weekly activity error:', error);
        setWeeklyActivityError(error.message || 'Failed to load weekly activity. Showing defaults.');
        setWeeklyActivity(defaultWeeklyActivity);
      } finally {
        if (isMounted) {
          setWeeklyActivityLoading(false);
        }
      }
    };

    const fetchRecentJobs = async () => {
      setRecentJobsLoading(true);
      setRecentJobsError('');

      try {
        const res = await fetch(`${API_BASE_URL}/api/profile/recent-jobs/${userId}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to load recent jobs');
        }

        const normalized = normalizeRecentJobs(data.recentJobs);

        if (!isMounted) return;

        setRecentJobs(normalized);
        updateCachedRecentJobs(normalized);

        if (data.isDefault) {
          await saveRecentJobs(normalized, { silent: true, updateState: false });
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Fetch recent jobs error:', error);
        setRecentJobsError(error.message || 'Failed to load recent jobs. Showing defaults.');
        setRecentJobs(recentJobsSeed);
      } finally {
        if (isMounted) {
          setRecentJobsLoading(false);
        }
      }
    };

    fetchAnalytics();
    fetchWeeklyActivity();
    fetchRecentJobs();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const greetingName = user?.fullName ? user.fullName.split(' ')[0] : 'there';

  return (
    <>
      {showWelcomePopup && user && (
        <WelcomePopup
          user={user}
          onClose={() => setShowWelcomePopup(false)}
        />
      )}
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 dark:text-gray-200 text-gray-900">
              {`Welcome back, ${greetingName}!`}
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
            value={analytics.cvsCreated.value}
            icon={FileTextIcon}
            trend={getTrendText('cvsCreated', analytics.cvsCreated)}
            trendUp={analytics.cvsCreated.trendUp}
          />
          <StatsCard
            title="Jobs Applied"
            value={analytics.jobsApplied.value}
            icon={BriefcaseIcon}
            trend={getTrendText('jobsApplied', analytics.jobsApplied)}
            trendUp={analytics.jobsApplied.trendUp}
          />
          <StatsCard
            title="CVs Sent"
            value={analytics.cvsSent.value}
            icon={SendIcon}
            trend={getTrendText('cvsSent', analytics.cvsSent)}
            trendUp={analytics.cvsSent.trendUp}
          />
          <StatsCard
            title="Skill Match"
            value={analytics.skillMatch.value}
            icon={TrendingUpIcon}
            trend={getTrendText('skillMatch', analytics.skillMatch)}
            trendUp={analytics.skillMatch.trendUp}
          />
        </div>
        {(analyticsLoading || analyticsError || weeklyActivityLoading || weeklyActivityError || recentJobsLoading || recentJobsError) && (
          <div>
            {analyticsLoading && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Syncing your analytics...
              </p>
            )}
            {analyticsError && (
              <div
                className="mt-2 rounded-lg border border-[rgba(212,24,61,0.25)] bg-[rgba(212,24,61,0.08)] px-3 py-2 text-xs"
                style={{ color: '#D4183D' }}
              >
                {analyticsError}
              </div>
            )}
            {weeklyActivityLoading && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Loading weekly activity...
              </p>
            )}
            {weeklyActivityError && (
              <div
                className="mt-2 rounded-lg border border-[rgba(212,24,61,0.25)] bg-[rgba(212,24,61,0.08)] px-3 py-2 text-xs"
                style={{ color: '#D4183D' }}
              >
                {weeklyActivityError}
              </div>
            )}
            {recentJobsLoading && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Loading recent jobs...
              </p>
            )}
            {recentJobsError && (
              <div
                className="mt-2 rounded-lg border border-[rgba(212,24,61,0.25)] bg-[rgba(212,24,61,0.08)] px-3 py-2 text-xs"
                style={{ color: '#D4183D' }}
              >
                {recentJobsError}
              </div>
            )}
          </div>
        )}

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
                <LineChart data={weeklyActivity}>
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

          {/* Recent Jobs */}
          <div 
            className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)]"
          >
            <div className="p-4 sm:p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-1 dark:text-gray-200 text-gray-900">Recent Jobs</h3>
                <p className="text-sm dark:text-gray-400 text-gray-500">Your latest applications and activity</p>
              </div>
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <div key={job.id} className="flex gap-3">
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
                      <p className="text-sm font-medium dark:text-gray-200 text-gray-900">
                        {job.title}
                        <span className="dark:text-gray-400 text-gray-500"> — {job.company}</span>
                      </p>
                      <p className="text-xs mt-0.5 dark:text-gray-400 text-gray-500">
                        {formatTimeAgo(job.appliedAt)}
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
    </>
  );
}

export default DashboardPage;

