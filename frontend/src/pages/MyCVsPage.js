import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../utils/apiConfig';

// SVG Icons
function DownloadIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
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


function MyCVsPage() {
  const navigate = useNavigate();
  const [cvs, setCvs] = useState([]);
  const [user, setUser] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [cvName, setCvName] = useState('');
  const [previewCV, setPreviewCV] = useState(null);

  useEffect(() => {
    // Load user data
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
        
        // Load CVs from backend
        loadCVs(userData.id);
      } else {
        // If no user, show empty list
        setCvs([]);
      }
    } catch (error) {
      console.error('Error loading CVs:', error);
      setCvs([]);
    }
  }, []);

  const loadCVs = async (userId) => {
    try {
      // Load uploaded CVs from backend
      const res = await fetch(`${API_BASE_URL}/api/cv/user/${userId}`);
      const data = await res.json();
      
      let allCVs = [];
      if (data.success) {
        // Transform backend CVs to match frontend format
        // Only show uploaded CVs and generated/saved CVs from backend
        allCVs = data.cvs.map(cv => ({
          id: cv.id,
          type: cv.isCreated ? 'created' : 'uploaded',
          fileName: cv.originalFileName || cv.fileName,
          fileType: cv.fileType,
          fileSize: cv.fileSize,
          createdAt: cv.createdAt,
          templateName: cv.cvName || (cv.isCreated ? 'Created CV' : 'Uploaded CV'),
          position: cv.isCreated ? 'Created CV' : 'Uploaded Document',
          company: '',
        }));
      }

      // Only show CVs from backend (uploaded and generated/saved)
      setCvs(allCVs);
    } catch (error) {
      console.error('Error fetching CVs:', error);
      setCvs([]);
    }
  };

  const handleCardClick = async (cv) => {
    // Both uploaded and created CVs from backend can be previewed
    if (user?.id) {
      // Show preview popup with CV
      setPreviewCV(cv);
    }
  };

  const handleDownload = async (cv) => {
    // Both uploaded and created CVs from backend are PDFs, download directly
    if (user?.id) {
      try {
        const url = `${API_BASE_URL}/api/cv/${cv.id}/download?userId=${user.id}`;
        const link = document.createElement('a');
        link.href = url;
        link.download = cv.fileName || cv.templateName || 'cv.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading CV:', error);
        alert('Failed to download CV');
      }
    }
  };

  const handleDelete = async (cv) => {
    // Prevent deletion of created CVs (both from backend and localStorage)
    if (cv.type === 'created') {
      alert('Created CVs cannot be deleted. You can only delete uploaded CVs.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this CV?')) {
      if (cv.type === 'uploaded' && user?.id) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/cv/${cv.id}?userId=${user.id}`, {
            method: 'DELETE',
          });
          const data = await res.json();
          
          if (data.success) {
            // Update state
            setCvs(prev => prev.filter(c => c.id !== cv.id));
          } else {
            alert(data.error || 'Failed to delete CV');
          }
        } catch (error) {
          console.error('Error deleting CV:', error);
          alert('Failed to delete CV');
        }
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSaveUploadedCV = async () => {
    if (!uploadedFile || !user?.id) return;

    // Check CV limit before uploading (only count uploaded CVs)
    const uploadedCount = cvs.filter(cv => cv.type === 'uploaded').length;
    if (uploadedCount >= 3) {
      alert('Maximum CV upload limit reached. You can only upload 3 CVs. Please delete an existing uploaded CV to upload a new one.');
      return;
    }

    // Validate CV name
    if (!cvName.trim()) {
      alert('Please enter a name for your CV.');
      return;
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('cvFile', uploadedFile);
      formData.append('userId', user.id);
      formData.append('cvName', cvName.trim());

      const res = await fetch(`${API_BASE_URL}/api/cv/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        // Transform backend CV to match frontend format
        const cvEntry = {
          id: data.cv.id,
          type: 'uploaded',
          fileName: data.cv.originalFileName || data.cv.fileName,
          fileType: data.cv.fileType,
          fileSize: data.cv.fileSize,
          createdAt: data.cv.createdAt,
          templateName: data.cv.cvName || 'Uploaded CV',
          position: 'Uploaded Document',
          company: '',
        };

        // Update state
        setCvs([cvEntry, ...cvs]);
        
        // Reset and close modal
        setUploadedFile(null);
        setCvName('');
        setShowUploadModal(false);
        
        // Reset file input
        const fileInput = document.getElementById('cv-upload-input');
        if (fileInput) {
          fileInput.value = '';
        }
      } else {
        alert(data.error || 'Failed to upload CV. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading CV:', error);
      alert('Failed to upload CV. Please check your connection and try again.');
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
        <div className="flex gap-3">
          <button
            onClick={() => {
              const uploadedCount = cvs.filter(cv => cv.type === 'uploaded').length;
              if (uploadedCount >= 3) {
                alert('Maximum CV upload limit reached. You can only upload 3 CVs. Please delete an existing uploaded CV to upload a new one.');
                return;
              }
              setShowUploadModal(true);
            }}
            disabled={cvs.filter(cv => cv.type === 'uploaded').length >= 3}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-colors flex items-center gap-2 ${
              cvs.filter(cv => cv.type === 'uploaded').length >= 3 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{ backgroundColor: cvs.filter(cv => cv.type === 'uploaded').length >= 3 ? '#9CA3AF' : '#6CA6CD' }}
            onMouseEnter={(e) => {
              if (cvs.filter(cv => cv.type === 'uploaded').length < 3) {
                e.target.style.backgroundColor = 'rgba(108, 166, 205, 0.9)';
              }
            }}
            onMouseLeave={(e) => {
              if (cvs.filter(cv => cv.type === 'uploaded').length < 3) {
                e.target.style.backgroundColor = '#6CA6CD';
              }
            }}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload CV {cvs.filter(cv => cv.type === 'uploaded').length > 0 && `(${cvs.filter(cv => cv.type === 'uploaded').length}/3)`}
          </button>
        <button
            onClick={() => {
              const createdCount = cvs.filter(cv => cv.type === 'created').length;
              if (createdCount >= 3) {
                alert('Maximum CV creation limit reached. You can only create 3 CVs. Created CVs cannot be deleted.');
                return;
              }
              navigate('/create-cv');
            }}
            disabled={cvs.filter(cv => cv.type === 'created').length >= 3}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-colors flex items-center gap-2 ${
              cvs.filter(cv => cv.type === 'created').length >= 3 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{ backgroundColor: cvs.filter(cv => cv.type === 'created').length >= 3 ? '#9CA3AF' : '#6CA6CD' }}
          onMouseEnter={(e) => {
              if (cvs.filter(cv => cv.type === 'created').length < 3) {
            e.target.style.backgroundColor = 'rgba(108, 166, 205, 0.9)';
              }
          }}
          onMouseLeave={(e) => {
              if (cvs.filter(cv => cv.type === 'created').length < 3) {
            e.target.style.backgroundColor = '#6CA6CD';
              }
          }}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
            Create New CV {cvs.filter(cv => cv.type === 'created').length > 0 && `(${cvs.filter(cv => cv.type === 'created').length}/3)`}
        </button>
        </div>
      </div>

      {/* CVs Grid */}
      {cvs.length === 0 ? (
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
          {cvs.map((cv) => (
            <div
              key={cv.id}
              onClick={() => handleCardClick(cv)}
              className="rounded-lg shadow-sm hover:shadow-md transition-all dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)] overflow-hidden group cursor-pointer"
            >
              {/* Template Preview */}
              <div className="aspect-[3/4] relative overflow-hidden">
                {cv.type === 'uploaded' ? (
                  <div className="h-full w-full bg-gradient-to-br from-gray-400 to-gray-500 p-2 flex flex-col items-center justify-center">
                    <FileTextIcon className="h-8 w-8 text-white/80 mb-1" />
                    <p className="text-white/90 text-[10px] text-center px-1 truncate w-full">
                      {cv.fileName}
                    </p>
                    <p className="text-white/70 text-[10px] mt-0.5">
                      {cv.fileType?.includes('pdf') ? 'PDF' : 'DOC'}
                    </p>
                  </div>
                ) : (
                  <div className={`h-full w-full bg-gradient-to-br ${cv.templateColor || 'from-blue-500 to-blue-600'} p-2 flex flex-col gap-1`}>
                    <div className="h-2 bg-white/30 rounded w-3/4"></div>
                    <div className="h-1.5 bg-white/20 rounded w-full"></div>
                    <div className="h-1.5 bg-white/20 rounded w-5/6"></div>
                    <div className="mt-auto space-y-0.5">
                      <div className="h-1.5 bg-white/20 rounded w-full"></div>
                      <div className="h-1.5 bg-white/20 rounded w-4/5"></div>
                  </div>
                </div>
                )}
              </div>

              {/* CV Info */}
              <div className="p-2 space-y-1.5">
                <div>
                  <h3 className="font-semibold text-xs mb-0.5 dark:text-gray-200 text-gray-900 truncate">
                    {cv.templateName || 'CV Document'}
                  </h3>
                  {cv.type === 'uploaded' ? (
                    <p className="text-[10px] dark:text-gray-400 text-gray-500">
                      Uploaded File
                    </p>
                  ) : (
                    <>
                      <p className="text-xs font-medium dark:text-gray-300 text-gray-700 truncate">
                    {cv.position}
                  </p>
                      <p className="text-[10px] dark:text-gray-400 text-gray-500 truncate">
                    {cv.company}
                  </p>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between text-[10px] dark:text-gray-400 text-gray-500 pt-1 border-t dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)]">
                  <span>
                    {new Date(cv.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-1 pt-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleDownload(cv)}
                    className="flex-1 px-1.5 py-1 rounded text-[10px] font-medium border transition-colors dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 hover:bg-gray-50 dark:hover:bg-[rgba(108,166,205,0.1)] flex items-center justify-center gap-1"
                  >
                    <DownloadIcon className="h-3 w-3" />
                    <span>Download</span>
                  </button>
                  {cv.type === 'uploaded' && (
                  <button
                      onClick={() => handleDelete(cv)}
                      className="px-1 py-0.5 rounded text-[9px] font-medium border transition-colors dark:border-red-500/30 border-red-500/30 dark:text-red-400 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center"
                  >
                      <TrashIcon className="h-2.5 w-2.5" />
                  </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CV Preview Modal */}
      {previewCV && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" onClick={() => setPreviewCV(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{previewCV.templateName || previewCV.fileName || 'CV Preview'}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {previewCV.fileType?.includes('pdf') ? 'PDF Document' : 'Document'} • {previewCV.fileSize ? `${(previewCV.fileSize / 1024).toFixed(1)} KB` : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(previewCV)}
                  className="px-4 py-2 text-sm font-medium border-2 border-gray-200 rounded-lg text-gray-700 hover:border-gray-300 transition-colors flex items-center gap-2"
                >
                  <DownloadIcon className="h-4 w-4" />
                  Download
                </button>
                <button
                  onClick={() => setPreviewCV(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-auto p-4 bg-gray-50">
              {previewCV.type === 'uploaded' && user?.id ? (
                <iframe
                  src={`${API_BASE_URL}/api/cv/${previewCV.id}/preview?userId=${user.id}`}
                  className="w-full h-full min-h-[600px] border-0 rounded-lg"
                  title="CV Preview"
                />
              ) : (
                <div className="flex items-center justify-center h-full min-h-[400px]">
                  <p className="text-gray-500">Preview not available for this CV type</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload CV Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Upload CV</h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadedFile(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {cvs.filter(cv => cv.type === 'uploaded').length >= 3 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    Maximum CV Limit Reached
                  </p>
                  <p className="text-xs text-gray-500">
                    You have reached the maximum limit of 3 CVs. Please delete an existing CV to upload a new one.
                  </p>
                </div>
              ) : (
                <>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="text-sm text-gray-500 mb-2">
                      Upload your CV file (PDF, DOC, DOCX)
                    </p>
                  <p className="text-xs text-gray-400 mb-4">
                    {cvs.filter(cv => cv.type === 'uploaded').length}/3 CVs uploaded
                  </p>
                    <label className="cursor-pointer">
                      <input
                        id="cv-upload-input"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <div className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors inline-block">
                        Choose File
                      </div>
                    </label>
                    {uploadedFile && (
                      <p className="mt-4 text-sm text-gray-600 truncate">
                        Selected: {uploadedFile.name || 'CV file'}
                      </p>
                    )}
                  </div>
                  
                  {/* CV Name Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CV Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={cvName}
                      onChange={(e) => setCvName(e.target.value)}
                      placeholder="e.g., Software Engineer CV, Marketing Resume"
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                      maxLength={100}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Give your CV a descriptive name to easily identify it later
                    </p>
                  </div>
                </>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadedFile(null);
                    setCvName('');
                  }}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg font-medium text-gray-700 hover:border-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveUploadedCV}
                  disabled={!uploadedFile || !cvName.trim() || cvs.filter(cv => cv.type === 'uploaded').length >= 3}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                    !uploadedFile || !cvName.trim() || cvs.filter(cv => cv.type === 'uploaded').length >= 3
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyCVsPage;

