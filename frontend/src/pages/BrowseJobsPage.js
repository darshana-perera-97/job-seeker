import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// SVG Icons
function SearchIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function FilterIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  );
}

function MapPinIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function ClockIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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

let apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
apiBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
const API_BASE_URL = apiBaseUrl;

function BrowseJobsPage() {
  const navigate = useNavigate();
  const [jobType, setJobType] = useState('all');
  const [experience, setExperience] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/api/jobs`);
        const data = await res.json();

        if (data.success) {
          setJobs(Array.isArray(data.jobs) ? data.jobs : []);
        } else {
          setError(data.error || 'Failed to load jobs');
        }
      } catch (err) {
        console.error('Error loading jobs:', err);
        setError('Failed to load jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const normalizeString = (value) => (value || '').toLowerCase();

  const formatUpdatedAt = (isoDate) => {
    if (!isoDate) return 'Updated recently';
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return 'Updated recently';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'Updated just now';
    if (diffHours < 24) return `Updated ${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    if (diffDays < 7) return `Updated ${diffDays} day${diffDays === 1 ? '' : 's'} ago`;

    return `Updated on ${date.toLocaleDateString()}`;
  };

  const filteredJobs = useMemo(() => {
    const query = normalizeString(searchQuery);
    return jobs.filter((job) => {
      const title = normalizeString(job.title);
      const company = normalizeString(job.company);
      const country = normalizeString(job.country);
      const description = normalizeString(job.jobDescription);
      const requirements = Array.isArray(job.requirements)
        ? normalizeString(job.requirements.join(' '))
        : '';

      const matchesQuery =
        !query ||
        title.includes(query) ||
        company.includes(query) ||
        country.includes(query) ||
        description.includes(query) ||
        requirements.includes(query);

      const matchesType =
        jobType === 'all' ||
        normalizeString(job.jobType) === normalizeString(jobType) ||
        (jobType === 'remote' && normalizeString(job.jobType).includes('remote'));

      const matchesExperience =
        experience === 'all' ||
        normalizeString(job.experienceLevel).includes(normalizeString(experience));

      return matchesQuery && matchesType && matchesExperience;
    });
  }, [jobs, jobType, experience, searchQuery]);

  const handleApplyNow = (jobId) => {
    const job = jobs.find((item) => item.id === jobId);
    if (job?.siteLink) {
      window.open(job.siteLink, '_blank', 'noopener,noreferrer');
      return;
    }
    if (job?.contactEmail) {
      window.location.href = `mailto:${job.contactEmail}`;
      return;
    }
    navigate('/create-cv');
  };

  const handleViewDetails = (jobId) => {
    const job = jobs.find((item) => item.id === jobId);
    if (job?.siteLink) {
      window.open(job.siteLink, '_blank', 'noopener,noreferrer');
    } else if (job?.contactEmail) {
      window.location.href = `mailto:${job.contactEmail}`;
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 dark:text-gray-200 text-gray-900">
          Browse Jobs
        </h1>
        <p className="text-sm sm:text-base dark:text-gray-400 text-gray-500">
          Find opportunities that match your skills and experience
        </p>
      </div>

      {/* Search and Filters */}
      <div 
        className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)]"
      >
        <div className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 dark:text-gray-400 text-gray-500" />
              <input
                type="text"
                placeholder="Search by job title, company, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
              />
            </div>
            <div className="relative">
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full md:w-48 px-4 py-2.5 pr-10 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50 appearance-none cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="fulltime">Full-time</option>
                <option value="contract">Contract</option>
                <option value="remote">Remote</option>
              </select>
              <FilterIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 dark:text-gray-400 text-gray-500 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full md:w-48 px-4 py-2.5 pr-10 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50 appearance-none cursor-pointer"
              >
                <option value="all">All Levels</option>
                <option value="junior">Junior (0-2 years)</option>
                <option value="mid">Mid (3-5 years)</option>
                <option value="senior">Senior (5+ years)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {loading && (
          <div className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)] p-6 text-center">
            <p className="text-sm sm:text-base dark:text-gray-300 text-gray-600">Loading jobs...</p>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-xl shadow-sm dark:bg-red-900/40 bg-red-50 border border-red-200 p-6 text-center">
            <p className="text-sm sm:text-base text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}

        {!loading && !error && filteredJobs.length === 0 && (
          <div className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)] p-6 text-center">
            <h3 className="text-lg font-semibold mb-2 dark:text-gray-200 text-gray-900">No jobs found</h3>
            <p className="text-sm dark:text-gray-400 text-gray-500">
              Try adjusting your filters or search terms to find more opportunities.
            </p>
          </div>
        )}

        {!loading && !error && filteredJobs.map((job) => (
          <div
            key={job.id}
            className="rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)]"
          >
            <div className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1 group-hover:text-[#6CA6CD] transition-colors dark:text-gray-200 text-gray-900">
                        {job.title}
                      </h3>
                      <p className="text-sm dark:text-gray-400 text-gray-500">
                        {job.company} • {job.country}
                      </p>
                    </div>
                    <span className="text-sm font-medium dark:text-gray-300 text-gray-600">
                      {formatUpdatedAt(job.updatedAt)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm dark:text-gray-400 text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="h-4 w-4" />
                      {job.country}
                    </span>
                    <span className="flex items-center gap-1">
                      <BriefcaseIcon className="h-4 w-4" />
                      {job.jobType || 'N/A'}
                    </span>
                    <span className="flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" />
                      {job.experienceLevel || 'Experience not specified'}
                    </span>
                    <span className="font-medium dark:text-gray-200 text-gray-900">
                      {job.salaryRange || 'Salary not disclosed'}
                    </span>
                  </div>

                  {job.jobDescription && (
                    <p className="text-sm leading-relaxed dark:text-gray-300 text-gray-600">
                      {job.jobDescription}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {(job.requirements || []).map((requirement) => (
                      <span
                        key={requirement}
                        className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium transition-colors"
                        style={{
                          backgroundColor: 'rgba(108, 166, 205, 0.1)',
                          color: '#6CA6CD'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'rgba(108, 166, 205, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'rgba(108, 166, 205, 0.1)';
                        }}
                      >
                        {requirement}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex lg:flex-col gap-3">
                  <button
                    onClick={() => handleApplyNow(job.id)}
                    className="flex-1 lg:flex-initial px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-colors"
                    style={{ backgroundColor: '#6CA6CD' }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(108, 166, 205, 0.9)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#6CA6CD';
                    }}
                  >
                    Apply Now
                  </button>
                  {job.siteLink && (
                    <button
                      onClick={() => handleViewDetails(job.id)}
                      className="flex-1 lg:flex-initial px-6 py-2.5 rounded-xl text-sm font-medium border transition-colors dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 hover:bg-gray-50 dark:hover:bg-[rgba(108,166,205,0.1)]"
                    >
                      View Listing
                    </button>
                  )}
                  {job.contactEmail && (
                    <button
                      onClick={() => window.location.href = `mailto:${job.contactEmail}`}
                      className="flex-1 lg:flex-initial px-6 py-2.5 rounded-xl text-sm font-medium border transition-colors dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 hover:bg-gray-50 dark:hover:bg-[rgba(108,166,205,0.1)]"
                    >
                      Email Recruiter
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && !error && filteredJobs.length > 0 && (
        <div className="flex justify-center gap-2">
          <button
            disabled
            className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-400 text-gray-500 opacity-50 cursor-not-allowed"
          >
            Previous
          </button>
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: '#6CA6CD' }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(108, 166, 205, 0.9)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#6CA6CD';
            }}
          >
            1
          </button>
          <button className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 hover:bg-gray-50 dark:hover:bg-[rgba(108,166,205,0.1)]">
            2
          </button>
          <button className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 hover:bg-gray-50 dark:hover:bg-[rgba(108,166,205,0.1)]">
            3
          </button>
          <button className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 hover:bg-gray-50 dark:hover:bg-[rgba(108,166,205,0.1)]">
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default BrowseJobsPage;

