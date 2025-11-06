import { useNavigate, Link } from 'react-router-dom';

function SignupPage() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
    // For now, just navigate to home or dashboard
    navigate('/');
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
              <div className="space-y-2">
                <label htmlFor="fullname" className="block text-sm font-medium" style={{ color: '#1A1A1A' }}>
                  Full Name
                </label>
                <input
                  id="fullname"
                  type="text"
                  placeholder="John Doe"
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
                />
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirm-password" className="block text-sm font-medium" style={{ color: '#1A1A1A' }}>
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
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
                />
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                className="w-full h-12 sm:h-11 rounded-xl text-white font-medium transition-colors shadow-sm active:scale-[0.98]"
                style={{ 
                  backgroundColor: '#6CA6CD',
                  minHeight: '44px' // Minimum touch target size
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(108, 166, 205, 0.9)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#6CA6CD';
                }}
                onTouchStart={(e) => {
                  e.target.style.backgroundColor = 'rgba(108, 166, 205, 0.9)';
                }}
                onTouchEnd={(e) => {
                  e.target.style.backgroundColor = '#6CA6CD';
                }}
              >
                Sign Up
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

              {/* Google Button */}
              <button
                type="button"
                className="w-full h-12 sm:h-11 rounded-xl transition-colors font-medium flex items-center justify-center gap-2 active:scale-[0.98]"
                style={{
                  border: '1px solid rgba(108, 166, 205, 0.15)',
                  backgroundColor: 'transparent',
                  color: '#1A1A1A',
                  minHeight: '44px' // Minimum touch target size
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#F8FAFF';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
                onTouchStart={(e) => {
                  e.target.style.backgroundColor = '#F8FAFF';
                }}
                onTouchEnd={(e) => {
                  e.target.style.backgroundColor = 'transparent';
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

