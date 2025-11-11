import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JobSelection from './JobSelection';
import API_BASE_URL from '../utils/apiConfig';

function WelcomePopup({ user, onClose }) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [jobPreferences, setJobPreferences] = useState({ roles: [], countries: [], skills: [] });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [existingCVsCount, setExistingCVsCount] = useState(0);

  useEffect(() => {
    // Trigger animation on mount
    setTimeout(() => setIsVisible(true), 10);

    const loadPreferences = async () => {
      // Fallback to localStorage while fetching backend
      const savedPreferences = localStorage.getItem('jobPreferences');
      if (savedPreferences) {
        try {
          const parsed = JSON.parse(savedPreferences);
          setJobPreferences({
            roles: parsed.roles || [],
            countries: parsed.countries || [],
            skills: parsed.skills || [],
          });
        } catch (error) {
          console.error('Error parsing job preferences:', error);
        }
      }

      if (!user?.id) return;

      try {
        const res = await fetch(`${API_BASE_URL}/api/job-preferences/${user.id}`);
        const data = await res.json();
        if (data.success && data.preference) {
          setJobPreferences({
            roles: Array.isArray(data.preference.roles) ? data.preference.roles : [],
            countries: Array.isArray(data.preference.countries) ? data.preference.countries : [],
            skills: Array.isArray(data.preference.skills) ? data.preference.skills : [],
          });

          // Sync to localStorage for quick reuse
          localStorage.setItem('jobPreferences', JSON.stringify({
            roles: Array.isArray(data.preference.roles) ? data.preference.roles : [],
            countries: Array.isArray(data.preference.countries) ? data.preference.countries : [],
            skills: Array.isArray(data.preference.skills) ? data.preference.skills : [],
            timestamp: data.preference.updatedAt || new Date().toISOString(),
          }));
        }
      } catch (error) {
        console.error('Error loading job preferences:', error);
      }
    };

    const init = async () => {
      await loadPreferences();

      // Check existing CVs count
      if (user?.id) {
        checkCVsCount(user.id);
      }
    };

    init();
  }, [user?.id]);

  const checkCVsCount = async (userId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/cv/user/${userId}`);
      const data = await res.json();
      if (data.success) {
        setExistingCVsCount(data.cvs.length);
      }
    } catch (error) {
      console.error('Error checking CVs count:', error);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(async () => {
      // Mark that user has seen the welcome popup (per-user flag)
      if (user?.id) {
        localStorage.setItem(`hasSeenWelcomePopup_${user.id}`, 'true');
      }
      // Save job preferences to backend
      if (jobPreferences.roles.length > 0 || jobPreferences.countries.length > 0) {
        const timestamp = new Date().toISOString();
        const userStr = localStorage.getItem('user');
        const userId = user?.id || (userStr ? JSON.parse(userStr)?.id : null);

        if (userId) {
          try {
            await fetch(`${API_BASE_URL}/api/job-preferences`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId,
                roles: jobPreferences.roles,
                countries: jobPreferences.countries,
                skills: Array.isArray(jobPreferences.skills) ? jobPreferences.skills : [],
                updatedAt: timestamp,
              }),
            });
            localStorage.setItem('jobPreferences', JSON.stringify({
              roles: jobPreferences.roles,
              countries: jobPreferences.countries,
              skills: Array.isArray(jobPreferences.skills) ? jobPreferences.skills : [],
              timestamp,
            }));
          } catch (error) {
            console.error('Error saving job preferences:', error);
          }
        }
      }
      onClose();
    }, 300);
  };

  const handleJobDataChange = (data) => {
    setJobPreferences(data);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const saveUploadedCV = async () => {
    if (!uploadedFile || !user?.id) return;

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('cvFile', uploadedFile);
      formData.append('userId', user.id);

      const res = await fetch(`${API_BASE_URL}/api/cv/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        console.error('Error saving uploaded CV:', data.error);
        // Show error to user if limit reached
        if (data.error && data.error.includes('limit')) {
          alert(data.error);
        }
      }
    } catch (error) {
      console.error('Error uploading CV:', error);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save uploaded CV if one was uploaded
      if (uploadedFile) {
        saveUploadedCV();
      }
      handleClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateCV = () => {
    handleClose();
    navigate('/create-cv');
  };

  const greetingName = user?.fullName ? user.fullName.split(' ')[0] : 'there';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isVisible ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={currentStep === 1 ? handleClose : undefined}
      />

      {/* Popup */}
      <div
        className={`relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transition-all duration-300 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {/* Step Indicator */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">Step {currentStep} of 3</span>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-2 w-8 rounded-full transition-all ${
                    step === currentStep
                      ? 'bg-gray-900'
                      : step < currentStep
                      ? 'bg-gray-400'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Step 1: Greeting */}
          {currentStep === 1 && (
            <div className="text-center py-8">
              <div className="mb-6">
                <div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-4"
                  style={{
                    background: 'linear-gradient(to bottom right, rgba(108, 166, 205, 0.2), rgba(178, 165, 255, 0.2))',
                  }}
                >
                  <svg
                    className="h-8 w-8"
                    style={{ color: '#6CA6CD' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                  Welcome, {greetingName}!
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                  We're excited to have you here. Let's set up your account to get started on your job search journey.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Set Target */}
          {currentStep === 2 && (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Set Target
                </h2>
                <p className="text-gray-600">
                  Choose your preferred job roles and target countries
                </p>
              </div>
              <JobSelection
                initialRoles={jobPreferences.roles}
                initialCountries={jobPreferences.countries}
                onDataChange={handleJobDataChange}
              />
            </div>
          )}

          {/* Step 3: Select CV */}
          {currentStep === 3 && (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Select CV
                </h2>
                <p className="text-gray-600">
                  Upload your existing CV or create a new one with AI
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left: Upload CV */}
                <div className={`border-2 border-dashed rounded-xl p-6 transition-colors ${
                  existingCVsCount >= 3 
                    ? 'border-gray-200 bg-gray-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <div className="text-center">
                    <div className="mb-4">
                      {existingCVsCount >= 3 ? (
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
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
                      ) : (
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
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
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload CV</h3>
                    {existingCVsCount >= 3 ? (
                      <>
                        <p className="text-sm font-medium text-gray-900 mb-2">
                          Maximum Limit Reached
                        </p>
                        <p className="text-xs text-gray-500 mb-4">
                          You have reached the maximum limit of 3 CVs. Please delete an existing CV from My CVs page to upload a new one.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-gray-500 mb-2">
                          Upload your existing CV file (PDF, DOC, DOCX)
                        </p>
                        <p className="text-xs text-gray-400 mb-4">
                          {existingCVsCount}/3 CVs uploaded
                        </p>
                        <label className={`cursor-pointer ${existingCVsCount >= 3 ? 'pointer-events-none opacity-50' : ''}`}>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileUpload}
                            disabled={existingCVsCount >= 3}
                            className="hidden"
                          />
                          <div className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors inline-block">
                            Choose File
                          </div>
                        </label>
                        {uploadedFile && (
                          <p className="mt-3 text-sm text-gray-600 truncate">
                            Selected: {uploadedFile.name || uploadedFile.file?.name || 'CV file'}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Right: Create CV */}
                <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors bg-gradient-to-br from-gray-50 to-white">
                  <div className="text-center h-full flex flex-col justify-between">
                    <div>
                      <div className="mb-4">
                        <div
                          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
                          style={{
                            background: 'linear-gradient(to bottom right, rgba(108, 166, 205, 0.2), rgba(178, 165, 255, 0.2))',
                          }}
                        >
                          <svg
                            className="h-6 w-6"
                            style={{ color: '#6CA6CD' }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Create CV</h3>
                      <p className="text-sm text-gray-500 mb-6">
                        Use AI to create a professional CV tailored to your profile
                      </p>
                    </div>
                    <button
                      onClick={handleCreateCV}
                      className="relative px-8 py-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white rounded-xl font-semibold hover:shadow-2xl transition-all shadow-lg overflow-hidden group transform hover:scale-105"
                      style={{
                        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
                        backgroundSize: '200% 200%',
                      }}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                        <svg
                          className="h-6 w-6 animate-pulse"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        <span className="relative">
                          Create Now
                          <span className="absolute -top-1 -right-1 h-2 w-2 bg-white rounded-full animate-ping opacity-75" />
                        </span>
                      </span>
                      {/* Animated shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-700/50 via-gray-600/50 to-gray-700/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-between items-center">
          <button
            onClick={currentStep === 1 ? handleClose : handleBack}
            className="px-6 py-2 text-gray-700 border-2 border-gray-200 rounded-lg font-medium hover:border-gray-300 transition-colors"
          >
            {currentStep === 1 ? 'Skip' : 'Back'}
          </button>
          <button
            onClick={handleNext}
            disabled={currentStep === 2 && (jobPreferences.roles.length === 0 || jobPreferences.countries.length === 0)}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              currentStep === 2 && (jobPreferences.roles.length === 0 || jobPreferences.countries.length === 0)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            {currentStep === 3 ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomePopup;
