import { useEffect, useMemo, useState } from 'react';
import API_BASE_URL from '../utils/apiConfig';

function DownloadIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function formatDate(value) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function AppliedJobsPage() {
  const [user, setUser] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('Error reading user from localStorage:', err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user?.id) {
      setAppliedJobs([]);
      setLoading(false);
      return;
    }

    let isCancelled = false;

    const fetchAppliedJobs = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE_URL}/api/applied-jobs/${user.id}`);
        const data = await res.json();

        if (isCancelled) {
          return;
        }

        if (res.ok && data.success) {
          const jobs = Array.isArray(data.jobs) ? data.jobs : [];

          const normalized = jobs.map((job, index) => {
            const appliedDate = job?.appliedDate || new Date().toISOString();
            return {
              id: `${user.id}-${index}-${appliedDate}`,
              jobTitle: job?.jobTitle || 'Job Title',
              company: job?.company || 'Company',
              appliedDate,
              country: job?.country || 'Country',
            };
          });

          setAppliedJobs(normalized);
        } else {
          setAppliedJobs([]);
          setError(data?.error || 'Failed to load applied jobs');
        }
      } catch (fetchError) {
        console.error('Error fetching applied jobs:', fetchError);
        if (!isCancelled) {
          setError('Failed to load applied jobs');
          setAppliedJobs([]);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchAppliedJobs();

    return () => {
      isCancelled = true;
    };
  }, [user]);

  const sortedJobs = useMemo(() => {
    return [...appliedJobs].sort((a, b) => {
      const dateA = a.appliedDate ? new Date(a.appliedDate).getTime() : 0;
      const dateB = b.appliedDate ? new Date(b.appliedDate).getTime() : 0;
      return dateB - dateA;
    });
  }, [appliedJobs]);

  const handleExport = () => {
    if (!sortedJobs.length) {
      alert('No applied jobs to export yet.');
      return;
    }

    alert('Exporting applied jobs data...');
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 dark:text-gray-200 text-gray-900">
            Applied Jobs
          </h1>
          <p className="text-sm sm:text-base dark:text-gray-400 text-gray-500">
            Review the roles you have applied to recently
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-xl text-sm font-medium border transition-colors dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 hover:bg-gray-50 dark:hover:bg-[rgba(108,166,205,0.1)] flex items-center gap-2"
          >
            <DownloadIcon className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)] overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm dark:text-gray-400 text-gray-600">
            Loading applied jobs...
          </div>
        ) : error ? (
          <div className="p-6 text-sm dark:text-red-400 text-red-600">
            {error}
          </div>
        ) : sortedJobs.length === 0 ? (
          <div className="p-6 text-sm dark:text-gray-400 text-gray-600">
            You have not applied to any jobs yet. Visit the Browse Jobs page to explore new opportunities.
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-[rgba(108,166,205,0.25)] border-[rgba(108,166,205,0.15)]">
                <th className="text-left px-4 sm:px-6 py-3 text-sm font-medium dark:text-gray-200 text-gray-900">
                  Job Title
                </th>
                <th className="text-left px-4 sm:px-6 py-3 text-sm font-medium dark:text-gray-200 text-gray-900">
                  Company
                </th>
                <th className="text-left px-4 sm:px-6 py-3 text-sm font-medium dark:text-gray-200 text-gray-900">
                  Applied Date
                </th>
                <th className="text-left px-4 sm:px-6 py-3 text-sm font-medium dark:text-gray-200 text-gray-900">
                    Country
                </th>
              </tr>
            </thead>
            <tbody>
                {sortedJobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-b dark:border-[rgba(108,166,205,0.25)] border-[rgba(108,166,205,0.15)] hover:bg-gray-50 dark:hover:bg-[rgba(108,166,205,0.05)] transition-colors"
                >
                  <td className="px-4 sm:px-6 py-4 text-sm font-medium dark:text-gray-200 text-gray-900">
                    {job.jobTitle}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm dark:text-gray-300 text-gray-700">
                    {job.company}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm dark:text-gray-300 text-gray-700">
                      {formatDate(job.appliedDate)}
                  </td>
                    <td className="px-4 sm:px-6 py-4 text-sm dark:text-gray-300 text-gray-700">
                      {job.country || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
}

export default AppliedJobsPage;

