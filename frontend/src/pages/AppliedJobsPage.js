import { useState } from 'react';

// SVG Icons
function EyeIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function DownloadIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

const appliedJobs = [
  {
    id: 1,
    jobTitle: 'Senior Frontend Developer',
    company: 'Tech Corp',
    appliedDate: '2024-10-28',
    status: 'Under Review',
    response: 'Pending',
  },
  {
    id: 2,
    jobTitle: 'Full Stack Engineer',
    company: 'StartupXYZ',
    appliedDate: '2024-10-25',
    status: 'Interview Scheduled',
    response: 'Positive',
  },
  {
    id: 3,
    jobTitle: 'Lead Frontend Architect',
    company: 'Enterprise Solutions',
    appliedDate: '2024-10-30',
    status: 'Application Sent',
    response: 'Pending',
  },
  {
    id: 4,
    jobTitle: 'UI/UX Developer',
    company: 'Design Studio',
    appliedDate: '2024-10-20',
    status: 'Rejected',
    response: 'Negative',
  },
  {
    id: 5,
    jobTitle: 'React Native Developer',
    company: 'Mobile First Inc',
    appliedDate: '2024-10-22',
    status: 'Under Review',
    response: 'Pending',
  },
  {
    id: 6,
    jobTitle: 'Frontend Developer',
    company: 'FinTech Startup',
    appliedDate: '2024-10-18',
    status: 'Offer Received',
    response: 'Positive',
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Under Review':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'Interview Scheduled':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    case 'Application Sent':
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    case 'Rejected':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'Offer Received':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  }
};

const getResponseColor = (response) => {
  switch (response) {
    case 'Positive':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'Negative':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  }
};

function AppliedJobsPage() {
  const handleExport = () => {
    // Handle export logic here
    alert('Exporting applied jobs data...');
  };

  const handleViewJob = (jobId) => {
    // Handle view job logic here
    console.log('Viewing job:', jobId);
  };

  const totalApplications = appliedJobs.length;
  const underReview = appliedJobs.filter((j) => j.status === 'Under Review').length;
  const interviews = appliedJobs.filter((j) => j.status === 'Interview Scheduled').length;
  const offers = appliedJobs.filter((j) => j.status === 'Offer Received').length;

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 dark:text-gray-200 text-gray-900">
            Applied Jobs
          </h1>
          <p className="text-sm sm:text-base dark:text-gray-400 text-gray-500">
            Track the status of your job applications
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
      <div 
        className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)] overflow-hidden"
      >
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
                  Status
                </th>
                <th className="text-left px-4 sm:px-6 py-3 text-sm font-medium dark:text-gray-200 text-gray-900">
                  Response
                </th>
                <th className="text-right px-4 sm:px-6 py-3 text-sm font-medium dark:text-gray-200 text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {appliedJobs.map((job) => (
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
                    {new Date(job.appliedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusColor(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${getResponseColor(
                        job.response
                      )}`}
                    >
                      {job.response}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    <button
                      onClick={() => handleViewJob(job.id)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[rgba(108,166,205,0.1)] transition-colors dark:text-gray-300 text-gray-700"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div 
          className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)]"
        >
          <div className="p-6">
            <p className="text-sm dark:text-gray-400 text-gray-500 mb-1">
              Total Applications
            </p>
            <h2 className="text-2xl font-bold dark:text-gray-200 text-gray-900">
              {totalApplications}
            </h2>
          </div>
        </div>
        <div 
          className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)]"
        >
          <div className="p-6">
            <p className="text-sm dark:text-gray-400 text-gray-500 mb-1">
              Under Review
            </p>
            <h2 className="text-2xl font-bold dark:text-gray-200 text-gray-900">
              {underReview}
            </h2>
          </div>
        </div>
        <div 
          className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)]"
        >
          <div className="p-6">
            <p className="text-sm dark:text-gray-400 text-gray-500 mb-1">
              Interviews
            </p>
            <h2 className="text-2xl font-bold dark:text-gray-200 text-gray-900">
              {interviews}
            </h2>
          </div>
        </div>
        <div 
          className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)]"
        >
          <div className="p-6">
            <p className="text-sm dark:text-gray-400 text-gray-500 mb-1">
              Offers
            </p>
            <h2 className="text-2xl font-bold dark:text-gray-200 text-gray-900">
              {offers}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppliedJobsPage;

