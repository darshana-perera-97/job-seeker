import { useState } from 'react';
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

const jobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'Tech Corp',
    location: 'New York, NY',
    type: 'Full-time',
    skills: ['React', 'TypeScript', 'CSS'],
    matchPercentage: 95,
    postedDate: '2 days ago',
    salary: '$120k - $150k',
  },
  {
    id: 2,
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    location: 'San Francisco, CA',
    type: 'Full-time',
    skills: ['React', 'Node.js', 'MongoDB'],
    matchPercentage: 87,
    postedDate: '1 week ago',
    salary: '$100k - $140k',
  },
  {
    id: 3,
    title: 'UI/UX Developer',
    company: 'Design Studio',
    location: 'Remote',
    type: 'Contract',
    skills: ['Figma', 'React', 'Tailwind'],
    matchPercentage: 82,
    postedDate: '3 days ago',
    salary: '$80k - $110k',
  },
  {
    id: 4,
    title: 'React Native Developer',
    company: 'Mobile First Inc',
    location: 'Austin, TX',
    type: 'Full-time',
    skills: ['React Native', 'TypeScript', 'Firebase'],
    matchPercentage: 78,
    postedDate: '5 days ago',
    salary: '$90k - $130k',
  },
  {
    id: 5,
    title: 'Lead Frontend Architect',
    company: 'Enterprise Solutions',
    location: 'Boston, MA',
    type: 'Full-time',
    skills: ['React', 'Architecture', 'Leadership'],
    matchPercentage: 91,
    postedDate: '1 day ago',
    salary: '$140k - $180k',
  },
  {
    id: 6,
    title: 'Frontend Developer',
    company: 'FinTech Startup',
    location: 'Chicago, IL',
    type: 'Full-time',
    skills: ['Vue.js', 'JavaScript', 'CSS'],
    matchPercentage: 72,
    postedDate: '1 week ago',
    salary: '$85k - $115k',
  },
];

function BrowseJobsPage() {
  const navigate = useNavigate();
  const [jobType, setJobType] = useState('all');
  const [experience, setExperience] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleApplyNow = (jobId) => {
    navigate('/create-cv');
  };

  const handleViewDetails = (jobId) => {
    // Handle view details logic here
    console.log('Viewing details for job:', jobId);
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
        {jobs.map((job) => (
          <div
            key={job.id}
            className="rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)]"
          >
            <div className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1 group-hover:text-[#6CA6CD] transition-colors dark:text-gray-200 text-gray-900">
                        {job.title}
                      </h3>
                      <p className="text-sm dark:text-gray-400 text-gray-500">
                        {job.company}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end mb-1">
                        <div className="h-2 w-16 dark:bg-gray-700 bg-gray-300 rounded-full overflow-hidden">
                          <div
                            className="h-full"
                            style={{
                              width: `${job.matchPercentage}%`,
                              background: 'linear-gradient(to right, #6CA6CD, #B2A5FF)'
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium" style={{ color: '#6CA6CD' }}>
                          {job.matchPercentage}% Match
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm dark:text-gray-400 text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="h-4 w-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <BriefcaseIcon className="h-4 w-4" />
                      {job.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" />
                      {job.postedDate}
                    </span>
                    <span className="font-medium dark:text-gray-200 text-gray-900">
                      {job.salary}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
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
                        {skill}
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
                  <button
                    onClick={() => handleViewDetails(job.id)}
                    className="flex-1 lg:flex-initial px-6 py-2.5 rounded-xl text-sm font-medium border transition-colors dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 hover:bg-gray-50 dark:hover:bg-[rgba(108,166,205,0.1)]"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
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
    </div>
  );
}

export default BrowseJobsPage;

