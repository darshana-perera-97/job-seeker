import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';

// Get API base URL and ensure it doesn't end with /api (we add that in the fetch calls)
let apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
// Remove trailing slash and /api if present
apiBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
const API_BASE_URL = apiBaseUrl;
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const [googleContainerReady, setGoogleContainerReady] = useState(false);
  const googleButtonRef = useRef(null);

  const handleGoogleSignIn = useCallback(async (response) => {
    try {
      setLoading(true);
      setError('');

      // Validate response structure (Identity Services format)
      if (!response || !response.credential) {
        throw new Error('Invalid response from Google Sign-In');
      }

      // Decode the credential (JWT token) to get user info
      const credential = response.credential;
      
      // Parse JWT payload (for client-side extraction)
      // Note: In production, you should verify the token on the backend
      let payload;
      try {
        const base64Url = credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        payload = JSON.parse(jsonPayload);
      } catch (parseError) {
        console.error('Error parsing JWT:', parseError);
        throw new Error('Failed to parse Google credential');
      }
      
      // Extract user data from JWT payload
      const googleUserData = {
        fullName: payload.name || payload.given_name + ' ' + (payload.family_name || '') || '',
        email: payload.email || '',
        googleId: payload.sub || '',
        profilePicture: payload.picture || null
      };

      // Validate required fields
      if (!googleUserData.email || !googleUserData.googleId) {
        throw new Error('Missing required user information from Google');
      }

      // Send to backend for verification and storage
      let res;
      try {
        res = await fetch(`${API_BASE_URL}/api/signup/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(googleUserData),
        });
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        throw new Error(`Cannot connect to backend server at ${API_BASE_URL}. Please make sure the backend server is running on port 5000.`);
      }

      if (!res.ok) {
        let errorData;
        try {
          const responseText = await res.text();
          console.error('Server error response:', responseText);
          errorData = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
          // If it's a 404, provide more helpful message
          if (res.status === 404) {
            throw new Error(`Endpoint not found: ${API_BASE_URL}/api/signup/google. Please make sure the backend server is running and has been restarted after adding the signup endpoint.`);
          }
          throw new Error(`Server error (${res.status}): Failed to parse error response`);
        }
        throw new Error(errorData.error || `Server error: ${res.status}`);
      }

      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error('Invalid response from server. Please try again.');
      }

      if (data.success) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isAuthenticated', 'true');
        
        // Set flag to show welcome popup for new signups (only if not existing user)
        if (data.user?.id && !data.isExisting) {
          localStorage.setItem(`showWelcomePopup_${data.user.id}`, 'true');
        }
        
        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        setError(data.error || 'Google signup failed');
      }
    } catch (err) {
      console.error('Google signup error:', err);
      setError(err.message || 'Failed to sign up with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    // Initialize Google Identity Services
    const initializeGoogleSignIn = () => {
      // Check if Google Identity Services is available
      if (!window.google || !window.google.accounts || !window.google.accounts.id) {
        console.warn('Google Identity Services not loaded');
        return;
      }

      if (!googleButtonRef.current) {
        return;
      }

      const clientId = GOOGLE_CLIENT_ID;
      
      if (!clientId) {
        console.warn('Google Client ID not configured. Google Sign-In will not work.');
        setGoogleReady(false);
        return;
      }

      try {
        // Initialize Google Identity Services
        // This replaces the deprecated gapi.auth2 module
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleSignIn,
          // Use 'select_account' prompt for better UX
          auto_select: false,
          // Cancel on tap outside for better UX
          cancel_on_tap_outside: true,
        });

        // Clear container before rendering (in case it was used before)
        if (googleButtonRef.current) {
          googleButtonRef.current.innerHTML = '';
        }

        // Render the sign-in button
        // This is the modern Identity Services approach
        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signup_with', // Use signup text for signup page
            type: 'standard',
            shape: 'rectangular',
          }
        );
        
        // Mark Google as ready (this will hide the fallback button)
        setGoogleReady(true);
      } catch (error) {
        console.error('Error initializing Google Sign-In:', error);
        setError('Failed to initialize Google Sign-In');
        setGoogleReady(false);
      }
    };

    // Only initialize if we have a Client ID and the container is ready
    if (!GOOGLE_CLIENT_ID) {
      setGoogleReady(false);
      return;
    }

    // Check if Google Identity Services script is already loaded
    if (window.google?.accounts?.id && googleContainerReady) {
      // Use a small delay to ensure the container is mounted
      const timer = setTimeout(() => {
        if (googleButtonRef.current && GOOGLE_CLIENT_ID && !googleReady) {
          initializeGoogleSignIn();
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // Wait for the script to load (it's loaded async in index.html)
      let checkInterval;
      let timeoutId;

      const checkGoogle = () => {
        if (window.google?.accounts?.id && googleContainerReady && GOOGLE_CLIENT_ID && !googleReady) {
          clearInterval(checkInterval);
          clearTimeout(timeoutId);
          // Small delay to ensure container is ready
          setTimeout(() => {
            initializeGoogleSignIn();
          }, 100);
        }
      };

      // Also check immediately
      checkGoogle();

      // Check every 100ms
      checkInterval = setInterval(checkGoogle, 100);

      // Cleanup after 10 seconds if Google doesn't load
      timeoutId = setTimeout(() => {
        clearInterval(checkInterval);
        if (!window.google?.accounts?.id) {
          console.warn('Google Identity Services failed to load after 10 seconds');
        }
      }, 10000);

      // Cleanup function
      return () => {
        clearInterval(checkInterval);
        clearTimeout(timeoutId);
      };
    }
  }, [handleGoogleSignIn, googleContainerReady]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      let res;
      try {
        res = await fetch(`${API_BASE_URL}/api/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password
          }),
        });
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        throw new Error(`Cannot connect to backend server at ${API_BASE_URL}. Please make sure the backend server is running on port 5000.`);
      }

      if (!res.ok) {
        let errorData;
        try {
          const responseText = await res.text();
          console.error('Server error response:', responseText);
          errorData = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
          // If it's a 404, provide more helpful message
          if (res.status === 404) {
            throw new Error(`Endpoint not found: ${API_BASE_URL}/api/signup. Please make sure the backend server is running and has been restarted after adding the signup endpoint.`);
          }
          throw new Error(`Server error (${res.status}): Failed to parse error response`);
        }
        throw new Error(errorData.error || `Server error: ${res.status}`);
      }

      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error('Invalid response from server. Please try again.');
      }

      if (data.success) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isAuthenticated', 'true');
        
        // Set flag to show welcome popup for new signups
        if (data.user?.id) {
          localStorage.setItem(`showWelcomePopup_${data.user.id}`, 'true');
        }
        
        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        setError(data.error || 'Signup failed. Please try again.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to sign up. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Illustration */}
      <div 
        className="hidden lg:flex lg:flex-1 items-center justify-center p-8 xl:p-12"
        style={{
          background: 'linear-gradient(to bottom right, rgba(178, 165, 255, 0.1), rgba(108, 166, 205, 0.1), #F8FAFF)'
        }}
      >
        <div className="max-w-lg w-full">
          <div className="mb-6 xl:mb-8 text-center">
            <h2 className="text-xl xl:text-2xl font-bold mb-2 xl:mb-3" style={{ color: '#1A1A1A' }}>Start Your Journey</h2>
            <p className="text-sm xl:text-base px-4" style={{ color: '#5A5A5A' }}>
              Join thousands of professionals who found their dream job with our platform
            </p>
          </div>
          <div className="w-full h-80 xl:h-96 rounded-2xl xl:rounded-3xl shadow-2xl flex items-center justify-center" style={{
            background: 'linear-gradient(to bottom right, rgba(178, 165, 255, 0.2), rgba(108, 166, 205, 0.2))'
          }}>
            <svg className="w-40 h-40 xl:w-48 xl:h-48" style={{ color: '#B2A5FF' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Right side - Signup Form */}
      <div 
        className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 py-6 sm:py-8 md:py-12" 
        style={{ backgroundColor: '#F8FAFF' }}
      >
        <div className="w-full max-w-md">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4 sm:mb-6">
              <div 
                className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl flex-shrink-0"
                style={{
                  background: 'linear-gradient(to bottom right, #6CA6CD, #B2A5FF)'
                }}
              >
                <svg
                  className="h-6 w-6 sm:h-7 sm:w-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold" style={{ color: '#1A1A1A' }}>CV Creator</h1>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#1A1A1A' }}>Create your account</h2>
            <p className="text-sm sm:text-base" style={{ color: '#5A5A5A' }}>
              Get started with your professional journey
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg" style={{ 
            backgroundColor: '#ffffff',
            border: '1px solid rgba(108, 166, 205, 0.15)'
          }}>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Full Name Field */}
              {/* Error Message */}
              {error && (
                <div className="rounded-xl p-3 text-sm" style={{ 
                  backgroundColor: '#FEE2E2',
                  color: '#DC2626',
                  border: '1px solid #FCA5A5'
                }}>
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-medium" style={{ color: '#1A1A1A' }}>
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full h-12 sm:h-11 px-4 text-base sm:text-sm rounded-xl transition-colors"
                  style={{
                    border: '1px solid rgba(108, 166, 205, 0.15)',
                    outline: 'none',
                    fontSize: '16px' // Prevents zoom on iOS
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6CA6CD';
                    e.target.style.boxShadow = '0 0 0 2px rgba(108, 166, 205, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(108, 166, 205, 0.15)';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                  disabled={loading}
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium" style={{ color: '#1A1A1A' }}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-12 sm:h-11 px-4 text-base sm:text-sm rounded-xl transition-colors"
                  style={{
                    border: '1px solid rgba(108, 166, 205, 0.15)',
                    outline: 'none',
                    fontSize: '16px' // Prevents zoom on iOS
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6CA6CD';
                    e.target.style.boxShadow = '0 0 0 2px rgba(108, 166, 205, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(108, 166, 205, 0.15)';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium" style={{ color: '#1A1A1A' }}>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-12 sm:h-11 px-4 text-base sm:text-sm rounded-xl transition-colors"
                  style={{
                    border: '1px solid rgba(108, 166, 205, 0.15)',
                    outline: 'none',
                    fontSize: '16px' // Prevents zoom on iOS
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6CA6CD';
                    e.target.style.boxShadow = '0 0 0 2px rgba(108, 166, 205, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(108, 166, 205, 0.15)';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                  disabled={loading}
                />
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium" style={{ color: '#1A1A1A' }}>
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full h-12 sm:h-11 px-4 text-base sm:text-sm rounded-xl transition-colors"
                  style={{
                    border: '1px solid rgba(108, 166, 205, 0.15)',
                    outline: 'none',
                    fontSize: '16px' // Prevents zoom on iOS
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6CA6CD';
                    e.target.style.boxShadow = '0 0 0 2px rgba(108, 166, 205, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(108, 166, 205, 0.15)';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                  disabled={loading}
                />
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 sm:h-11 rounded-xl text-white font-medium transition-colors shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: loading ? 'rgba(108, 166, 205, 0.7)' : '#6CA6CD',
                  minHeight: '44px' // Minimum touch target size
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = 'rgba(108, 166, 205, 0.9)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = '#6CA6CD';
                  }
                }}
                onTouchStart={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = 'rgba(108, 166, 205, 0.9)';
                  }
                }}
                onTouchEnd={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = '#6CA6CD';
                  }
                }}
              >
                {loading ? 'Signing up...' : 'Sign Up'}
              </button>

              {/* Divider */}
              <div className="relative my-5 sm:my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full" style={{ borderTop: '1px solid rgba(108, 166, 205, 0.15)' }}></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3" style={{ backgroundColor: '#ffffff', color: '#5A5A5A' }}>OR</span>
                </div>
              </div>

              {/* Google Button Container */}
              <div className="w-full" style={{ minHeight: '44px', position: 'relative' }}>
                {/* Always mount Google container when Client ID exists - it needs to be visible for Google to render */}
                {GOOGLE_CLIENT_ID && (
                  <div 
                    ref={(el) => {
                      googleButtonRef.current = el;
                      if (el) {
                        setGoogleContainerReady(true);
                      }
                    }}
                    className="w-full flex justify-center"
                    style={{ 
                      opacity: googleReady ? 1 : 0,
                      position: googleReady ? 'relative' : 'absolute',
                      pointerEvents: googleReady ? 'auto' : 'none',
                      zIndex: googleReady ? 2 : 0
                    }}
                  />
                )}
                
                {/* Show fallback button when Google is not ready or Client ID is missing */}
                {(!googleReady || !GOOGLE_CLIENT_ID) && (
                  <button
                    type="button"
                    disabled={loading}
                    className="w-full h-12 sm:h-11 rounded-xl transition-colors font-medium flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      border: '1px solid rgba(108, 166, 205, 0.15)',
                      backgroundColor: loading ? '#F8FAFF' : 'transparent',
                      color: '#1A1A1A',
                      minHeight: '44px',
                      position: 'relative',
                      zIndex: 1
                    }}
                    onClick={() => {
                      if (!GOOGLE_CLIENT_ID) {
                        setError('Google Client ID is not configured. Please add REACT_APP_GOOGLE_CLIENT_ID to your .env file and restart the server.');
                      } else if (!googleReady) {
                        // Check if Google is actually loading
                        if (window.google?.accounts?.id) {
                          setError('Initializing Google Sign-In... Please wait.');
                        } else {
                          setError('Google Sign-In is loading. Please wait a moment and try again.');
                        }
                      }
                    }}
                  >
                    <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="text-sm sm:text-base">Sign up with Google</span>
                  </button>
                )}
              </div>

              {/* Log In Link */}
              <p className="text-center text-xs sm:text-sm pt-2" style={{ color: '#5A5A5A' }}>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="hover:underline font-medium"
                  style={{ color: '#6CA6CD' }}
                >
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;

