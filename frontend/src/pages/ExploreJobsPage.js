import { useState, useEffect } from 'react';
import API_BASE_URL from '../utils/apiConfig';
import { getStoredUser } from '../utils/userStorage';

function ExploreJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Get user from localStorage
  useEffect(() => {
    try {
      const userData = getStoredUser();
      console.log('[ExploreJobsPage] User data from storage:', userData);
      if (userData) {
        setUser(userData);
      } else {
        console.warn('[ExploreJobsPage] No user data found in localStorage');
      }
    } catch (error) {
      console.error('[ExploreJobsPage] Error parsing user data:', error);
    }
  }, []);

  // Fetch explore jobs
  useEffect(() => {
    const fetchExploreJobs = async () => {
      if (!user?.id) {
        console.log('[ExploreJobsPage] No user ID found, skipping fetch');
        setLoading(false);
        setError('Please log in to view explore jobs.');
        return;
      }

      setLoading(true);
      setError(null);
      const url = `${API_BASE_URL}/api/explore-jobs/${user.id}`;
      console.log('[ExploreJobsPage] Fetching from:', url);
      
      try {
        const res = await fetch(url);
        console.log('[ExploreJobsPage] Response status:', res.status);
        
        const data = await res.json();
        console.log('[ExploreJobsPage] Response data:', data);

        if (res.ok && data.success) {
          // Backend has already filtered the jobs - we just display what we receive
          const jobsArray = Array.isArray(data.jobs) ? data.jobs : [];
          console.log('[ExploreJobsPage] Received filtered jobs from backend:', jobsArray.length);
          console.log('[ExploreJobsPage] Backend filtered', data.totalJobs, 'jobs down to', data.filteredCount);
          setJobs(jobsArray);
        } else {
          const errorMsg = data.error || 'Failed to load jobs';
          console.error('[ExploreJobsPage] Error:', errorMsg);
          setError(errorMsg);
        }
      } catch (err) {
        console.error('[ExploreJobsPage] Fetch error:', err);
        setError(`Failed to load jobs: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchExploreJobs();
  }, [user?.id]);

  const handleSendCV = (job) => {
    // Create mailto link with subject
    const subject = encodeURIComponent(`CV Application - ${job.job}`);
    const body = encodeURIComponent('Dear Hiring Manager,\n\nPlease find my CV attached.\n\nBest regards');
    window.location.href = `mailto:${job.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 dark:text-gray-200 text-gray-900">
          Explore Jobs
        </h1>
        <p className="text-sm sm:text-base dark:text-gray-400 text-gray-500">
          Browse companies matching your preferences and send your CV directly
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] p-6 text-center">
          <p className="text-sm sm:text-base dark:text-gray-300 text-gray-600">Loading jobs...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="rounded-xl shadow-sm dark:bg-red-900/40 bg-red-50 border border-red-200 p-6 text-center">
          <p className="text-sm sm:text-base text-red-700 dark:text-red-200 mb-2">{error}</p>
          {error.includes('log in') && (
            <p className="text-xs text-red-600 dark:text-red-300 mt-2">
              Please make sure you are logged in and try refreshing the page.
            </p>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && jobs.length === 0 && (
        <div className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] p-6 text-center">
          <h3 className="text-lg font-semibold mb-2 dark:text-gray-200 text-gray-900">No matching jobs found</h3>
          <p className="text-sm dark:text-gray-400 text-gray-500 mb-4">
            {user?.id 
              ? "We couldn't find any jobs matching your preferences. Please update your job preferences (roles and countries) to see relevant opportunities."
              : "Please log in and set your job preferences to see matching opportunities."
            }
          </p>
          {user?.id && (
            <a
              href="/profile"
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
              style={{ backgroundColor: '#6CA6CD' }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(108, 166, 205, 0.9)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#6CA6CD';
              }}
            >
              Update Preferences
            </a>
          )}
        </div>
      )}

      {/* Table */}
      {!loading && !error && jobs.length > 0 && (
        <div className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)]">
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider dark:text-gray-300 text-gray-700">
                    Job
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider dark:text-gray-300 text-gray-700">
                    Company Name
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider dark:text-gray-300 text-gray-700">
                    Country
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider dark:text-gray-300 text-gray-700">
                    Email
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider dark:text-gray-300 text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-[rgba(108,166,205,0.2)] divide-[rgba(108,166,205,0.15)]">
                {jobs.map((job) => (
                  <tr
                    key={job.id || `job-${job.companyName}-${job.job}`}
                    className="hover:bg-gray-50 dark:hover:bg-[rgba(108,166,205,0.05)] transition-colors"
                  >
                    <td className="px-4 sm:px-6 py-4">
                      <div className="text-sm font-medium dark:text-gray-200 text-gray-900">
                        {job.job || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="text-sm font-medium dark:text-gray-200 text-gray-900">
                        {job.companyName || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="text-sm dark:text-gray-400 text-gray-600">
                        {job.country || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="text-sm dark:text-gray-400 text-gray-600">
                        {job.email || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {job.sourceURL && (
                          <a
                            href={job.sourceURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 hover:bg-gray-50 dark:hover:bg-[rgba(108,166,205,0.1)]"
                          >
                            View Source
                          </a>
                        )}
                        <button
                          onClick={() => handleSendCV(job)}
                          className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
                          style={{ backgroundColor: '#6CA6CD' }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'rgba(108, 166, 205, 0.9)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#6CA6CD';
                          }}
                        >
                          Send CV
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info message */}
      {!loading && !error && jobs.length > 0 && (
        <div className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] p-4">
          <p className="text-sm dark:text-gray-400 text-gray-500">
            Showing {jobs.length} job{jobs.length !== 1 ? 's' : ''} matching your preferences. Click "Send CV" to open your email client and send your CV to the company.
          </p>
        </div>
      )}
    </div>
  );
}

export default ExploreJobsPage;

