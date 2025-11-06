import React from 'react';
import { useNavigate } from 'react-router-dom';

// SVG Icons
function DownloadIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function EyeIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function TrashIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1H9a1 1 0 00-1 1v3M4 7h16" />
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

// Sample CV data - in a real app, this would come from an API or state management
const sampleCVs = [
  {
    id: 1,
    templateName: 'Modern Professional',
    position: 'Senior Frontend Developer',
    company: 'Tech Corp Inc.',
    createdAt: '2024-10-28',
    templateColor: 'from-blue-500 to-blue-600',
  },
  {
    id: 2,
    templateName: 'Creative Bold',
    position: 'Full Stack Engineer',
    company: 'StartupXYZ',
    createdAt: '2024-10-25',
    templateColor: 'from-purple-500 to-purple-600',
  },
  {
    id: 3,
    templateName: 'Minimalist Clean',
    position: 'UI/UX Developer',
    company: 'Design Studio',
    createdAt: '2024-10-20',
    templateColor: 'from-gray-500 to-gray-600',
  },
  {
    id: 4,
    templateName: 'Executive Elite',
    position: 'Lead Frontend Architect',
    company: 'Enterprise Solutions',
    createdAt: '2024-10-18',
    templateColor: 'from-green-500 to-green-600',
  },
];

function MyCVsPage() {
  const navigate = useNavigate();

  const handleView = (cvId) => {
    // Navigate to view/edit CV
    console.log('View CV:', cvId);
  };

  const handleDownload = (cvId) => {
    // Handle download CV
    console.log('Download CV:', cvId);
    alert('Downloading CV...');
  };

  const handleDelete = (cvId) => {
    // Handle delete CV
    if (window.confirm('Are you sure you want to delete this CV?')) {
      console.log('Delete CV:', cvId);
      alert('CV deleted successfully');
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-semibold mb-2 dark:text-gray-200 text-gray-900">
            My CVs
          </h1>
          <p className="text-sm sm:text-base dark:text-gray-400 text-gray-500">
            Manage and view all your created CVs
          </p>
        </div>
        <button
          onClick={() => navigate('/create-cv')}
          className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-colors flex items-center gap-2"
          style={{ backgroundColor: '#6CA6CD' }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(108, 166, 205, 0.9)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#6CA6CD';
          }}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New CV
        </button>
      </div>

      {/* CVs Grid */}
      {sampleCVs.length === 0 ? (
        <div 
          className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)] p-12 text-center"
        >
          <FileTextIcon className="h-16 w-16 mx-auto mb-4 dark:text-gray-400 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2 dark:text-gray-200 text-gray-900">No CVs Created Yet</h3>
          <p className="text-sm dark:text-gray-400 text-gray-500 mb-6">
            Start by creating your first CV to get started
          </p>
          <button
            onClick={() => navigate('/create-cv')}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: '#6CA6CD' }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(108, 166, 205, 0.9)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#6CA6CD';
            }}
          >
            Create Your First CV
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {sampleCVs.map((cv) => (
            <div
              key={cv.id}
              className="rounded-xl shadow-sm hover:shadow-md transition-all dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)] overflow-hidden group"
            >
              {/* Template Preview */}
              <div className="aspect-[3/4] relative overflow-hidden">
                <div className={`h-full w-full bg-gradient-to-br ${cv.templateColor} p-4 flex flex-col gap-2`}>
                  <div className="h-3 bg-white/30 rounded w-3/4"></div>
                  <div className="h-2 bg-white/20 rounded w-full"></div>
                  <div className="h-2 bg-white/20 rounded w-5/6"></div>
                  <div className="mt-auto space-y-1">
                    <div className="h-2 bg-white/20 rounded w-full"></div>
                    <div className="h-2 bg-white/20 rounded w-4/5"></div>
                  </div>
                </div>
              </div>

              {/* CV Info */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-sm mb-1 dark:text-gray-200 text-gray-900">
                    {cv.templateName}
                  </h3>
                  <p className="text-sm font-medium dark:text-gray-300 text-gray-700">
                    {cv.position}
                  </p>
                  <p className="text-xs dark:text-gray-400 text-gray-500">
                    {cv.company}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs dark:text-gray-400 text-gray-500 pt-2 border-t dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)]">
                  <span>
                    {new Date(cv.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleView(cv.id)}
                    className="flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-colors dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 hover:bg-gray-50 dark:hover:bg-[rgba(108,166,205,0.1)] flex items-center justify-center gap-1.5"
                  >
                    <EyeIcon className="h-3.5 w-3.5" />
                    View
                  </button>
                  <button
                    onClick={() => handleDownload(cv.id)}
                    className="flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-colors dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 hover:bg-gray-50 dark:hover:bg-[rgba(108,166,205,0.1)] flex items-center justify-center gap-1.5"
                  >
                    <DownloadIcon className="h-3.5 w-3.5" />
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(cv.id)}
                    className="px-3 py-2 rounded-lg text-xs font-medium border transition-colors dark:border-red-500/30 border-red-500/30 dark:text-red-400 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center"
                  >
                    <TrashIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyCVsPage;

