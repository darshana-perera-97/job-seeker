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

function StarIcon({ className, filled = false }) {
  return (
    <svg 
      className={className} 
      fill={filled ? "currentColor" : "none"} 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
      />
    </svg>
  );
}

function StarRating({ rating = 0, maxRating = 5, size = "h-4 w-4" }) {
  const normalizedRating = Math.min(Math.max(Number(rating) || 0, 0), maxRating);
  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating % 1 >= 0.5;
  
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxRating }, (_, i) => {
        if (i < fullStars) {
          return (
            <StarIcon 
              key={i} 
              className={`${size} text-yellow-400`} 
              filled={true}
            />
          );
        } else if (i === fullStars && hasHalfStar) {
          return (
            <div key={i} className="relative">
              <StarIcon 
                className={`${size} text-gray-300 dark:text-gray-600`} 
                filled={false}
              />
              <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                <StarIcon 
                  className={`${size} text-yellow-400`} 
                  filled={true}
                />
              </div>
            </div>
          );
        } else {
          return (
            <StarIcon 
              key={i} 
              className={`${size} text-gray-300 dark:text-gray-600`} 
              filled={false}
            />
          );
        }
      })}
      {normalizedRating > 0 && (
        <span className="ml-1 text-xs font-medium dark:text-gray-400 text-gray-600">
          {normalizedRating.toFixed(1)}
        </span>
      )}
    </div>
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
  const [user, setUser] = useState(null);
  const [jobPreferences, setJobPreferences] = useState({ roles: [], countries: [], skills: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  // Get user from localStorage
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

  // Fetch job preferences
  useEffect(() => {
    const fetchJobPreferences = async () => {
      if (!user?.id) return;

      try {
        const res = await fetch(`${API_BASE_URL}/api/job-preferences/${user.id}`);
        const data = await res.json();

        if (res.ok && data.success && data.preference) {
          setJobPreferences({
            roles: Array.isArray(data.preference.roles) ? data.preference.roles : [],
            countries: Array.isArray(data.preference.countries) ? data.preference.countries : [],
            skills: Array.isArray(data.preference.skills) ? data.preference.skills : [],
          });
        }
      } catch (error) {
        console.error('Error loading job preferences:', error);
      }
    };

    fetchJobPreferences();
  }, [user?.id]);

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

  // Generate a random rating within a range (for consistent per-job ratings)
  const getRandomRating = (jobId, min, max) => {
    // Use job ID as seed for consistent random value per job
    const seed = jobId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (seed * 9301 + 49297) % 233280 / 233280;
    return Number((min + random * (max - min)).toFixed(1));
  };

  // Check if job matches basic filters (search, type, experience)
  const matchesBasicFilters = (job) => {
    const query = normalizeString(searchQuery);
    const title = normalizeString(job.title);
    const company = normalizeString(job.company);
    const country = normalizeString(job.country);
    const description = normalizeString(job.jobDescription || '');
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
  };

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
    const { roles, countries } = jobPreferences;
    
    // First, filter by basic filters (search, type, experience)
    const basicFiltered = jobs.filter(matchesBasicFilters);
    
    if (roles.length === 0 && countries.length === 0) {
      // If no preferences, show all jobs with no ratings
      return basicFiltered.map(job => ({
        ...job,
        rating: 0,
        category: 'all'
      })).sort((a, b) => {
        const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return dateB - dateA;
      });
    }

    // Categorize jobs into three groups (only show jobs that match role OR country)
    const perfectMatches = []; // Role + Country match (4.5 rating)
    const relatedJobs = []; // Same role, different countries (2.5-3.5 rating)
    const otherJobs = []; // Different roles, but in selected countries (0.5-1.5 rating)

    basicFiltered.forEach((job) => {
      const title = normalizeString(job.title);
      const country = normalizeString(job.country);
      
      const matchesRole = roles.length > 0 && roles.some(role => 
        title.includes(normalizeString(role))
      );
      
      const matchesCountry = countries.length > 0 && countries.some(prefCountry => 
        normalizeString(country) === normalizeString(prefCountry)
      );

      // Only include jobs that match at least role OR country
      if (matchesRole && matchesCountry) {
        // Perfect match: role + country
        perfectMatches.push({
          ...job,
          rating: 4.5,
          category: 'perfect'
        });
      } else if (matchesRole && !matchesCountry) {
        // Related job: same role, different country
        relatedJobs.push({
          ...job,
          rating: getRandomRating(job.id, 2.5, 3.5),
          category: 'related'
        });
      } else if (!matchesRole && matchesCountry) {
        // Other job: different role, but in selected country
        otherJobs.push({
          ...job,
          rating: getRandomRating(job.id, 0.5, 1.5),
          category: 'other'
        });
      }
      // Exclude jobs that match neither role nor country
    });

    // Sort each category by date (newest first)
    const sortByDate = (a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    };

    perfectMatches.sort(sortByDate);
    relatedJobs.sort(sortByDate);
    otherJobs.sort(sortByDate);

    // Combine in order: Perfect Matches, Related Jobs, Other Jobs
    return [...perfectMatches, ...relatedJobs, ...otherJobs];
  }, [jobs, jobType, experience, searchQuery, jobPreferences]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [jobType, experience, searchQuery, jobPreferences]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  // Get category label
  const getCategoryLabel = (category) => {
    switch (category) {
      case 'perfect':
        return 'Perfect Matches';
      case 'related':
        return 'Related Jobs';
      case 'other':
        return 'Other Jobs';
      default:
        return null;
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

        {!loading && !error && paginatedJobs.map((job, index) => {
          // Show section header if this is the first job of its category on this page
          const prevJob = index > 0 ? paginatedJobs[index - 1] : null;
          const showHeader = !prevJob || prevJob.category !== job.category;
          const categoryLabel = getCategoryLabel(job.category);

          return (
            <div key={job.id}>
              {showHeader && categoryLabel && (
                <div className="mb-4 mt-6 first:mt-0">
                  <h2 className="text-xl font-semibold dark:text-gray-200 text-gray-900">
                    {categoryLabel}
                  </h2>
                  <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">
                    {job.category === 'perfect' && 'Jobs matching your preferred role and country'}
                    {job.category === 'related' && 'Same role in different countries'}
                    {job.category === 'other' && 'Other opportunities in your preferred countries'}
                  </p>
                </div>
              )}
              <div
                className="rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)]"
              >
            <div className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                <div className="flex-1 space-y-4">
                   <div className="flex items-start justify-between gap-4">
                     <div className="flex-1">
                       <h3 className="text-lg font-semibold mb-1 group-hover:text-[#6CA6CD] transition-colors dark:text-gray-200 text-gray-900">
                         {job.title}
                       </h3>
                       <p className="text-sm dark:text-gray-400 text-gray-500 mb-1">
                         {job.company} • {job.country}
                       </p>
                       {job.rating > 0 && (
                         <StarRating rating={job.rating} size="h-4 w-4" />
                       )}
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
            </div>
          );
        })}
      </div>

      {!loading && !error && filteredJobs.length > 0 && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 flex-wrap">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 hover:bg-gray-50 dark:hover:bg-[rgba(108,166,205,0.1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            // Show first page, last page, current page, and pages around current
            const showPage = 
              page === 1 || 
              page === totalPages || 
              (page >= currentPage - 1 && page <= currentPage + 1);
            
            if (!showPage) {
              // Show ellipsis
              if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="px-2 text-gray-500 dark:text-gray-400">
                    ...
                  </span>
                );
              }
              return null;
            }

            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'text-white'
                    : 'border dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 hover:bg-gray-50 dark:hover:bg-[rgba(108,166,205,0.1)]'
                }`}
                style={
                  currentPage === page
                    ? {
                        backgroundColor: '#6CA6CD',
                      }
                    : {}
                }
                onMouseEnter={(e) => {
                  if (currentPage !== page) {
                    e.target.style.backgroundColor = '';
                  } else {
                    e.target.style.backgroundColor = 'rgba(108, 166, 205, 0.9)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage === page) {
                    e.target.style.backgroundColor = '#6CA6CD';
                  }
                }}
              >
                {page}
              </button>
            );
          })}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 hover:bg-gray-50 dark:hover:bg-[rgba(108,166,205,0.1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            Next
          </button>
        </div>
      )}
      
      {!loading && !error && filteredJobs.length > 0 && (
        <div className="text-center text-sm dark:text-gray-400 text-gray-500">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredJobs.length)} of {filteredJobs.length} jobs
        </div>
      )}
    </div>
  );
}

export default BrowseJobsPage;

