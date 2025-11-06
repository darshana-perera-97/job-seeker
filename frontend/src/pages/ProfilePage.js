import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// SVG Icons
function CameraIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function PlusIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function Trash2Icon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function ProfilePage() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([
    'React',
    'TypeScript',
    'Node.js',
    'CSS',
    'Git',
    'Figma',
  ]);
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 dark:text-gray-200 text-gray-900">
          My Profile
        </h1>
        <p className="text-sm sm:text-base dark:text-gray-400 text-gray-500">
          Manage your personal information and preferences
        </p>
      </div>

      {/* Profile Picture */}
      <div 
        className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)]"
      >
        <div className="p-6 sm:p-8">
          <h3 className="text-lg font-semibold mb-6 dark:text-gray-200 text-gray-900">
            Profile Picture
          </h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="relative">
              <div
                className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border-4 flex items-center justify-center text-white text-xl sm:text-2xl font-semibold"
                style={{
                  borderColor: 'rgba(108, 166, 205, 0.2)',
                  background: 'linear-gradient(to bottom right, #6CA6CD, #B2A5FF)'
                }}
              >
                JD
              </div>
              <button
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors"
                style={{ backgroundColor: '#6CA6CD' }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(108, 166, 205, 0.9)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#6CA6CD';
                }}
              >
                <CameraIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold mb-1 dark:text-gray-200 text-gray-900">
                John Doe
              </h4>
              <p className="text-sm sm:text-base dark:text-gray-400 text-gray-500 mb-3">
                john.doe@example.com
              </p>
              <button
                className="px-4 py-2 rounded-xl text-sm font-medium border transition-colors dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 hover:bg-gray-50 dark:hover:bg-[rgba(108,166,205,0.1)]"
              >
                Change Photo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div 
        className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)]"
      >
        <div className="p-6 sm:p-8">
          <h3 className="text-lg font-semibold mb-6 dark:text-gray-200 text-gray-900">
            Personal Information
          </h3>
          <form className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  defaultValue="John"
                  className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  defaultValue="Doe"
                  className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  defaultValue="john.doe@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  defaultValue="+1 234 567 8900"
                  className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="location" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  defaultValue="New York, NY"
                  className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="bio" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                  Professional Bio
                </label>
                <textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-2.5 rounded-xl border min-h-32 transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50 resize-none"
                  defaultValue="Experienced frontend developer with a passion for creating beautiful and functional web applications."
                />
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Skills */}
      <div 
        className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)]"
      >
        <div className="p-6 sm:p-8">
          <h3 className="text-lg font-semibold mb-6 dark:text-gray-200 text-gray-900">
            Skills
          </h3>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <div
                  key={skill}
                  className="rounded-lg px-3 py-1.5 flex items-center gap-2 transition-colors"
                  style={{
                    backgroundColor: 'rgba(108, 166, 205, 0.1)',
                    color: '#6CA6CD'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(108, 166, 205, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(108, 166, 205, 0.1)';
                  }}
                >
                  <span className="text-sm font-medium">{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    style={{ color: '#6CA6CD' }}
                  >
                    <Trash2Icon className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                className="flex-1 px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2.5 rounded-xl text-white transition-colors flex items-center justify-center"
                style={{ backgroundColor: '#6CA6CD' }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(108, 166, 205, 0.9)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#6CA6CD';
                }}
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Links */}
      <div 
        className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)]"
      >
        <div className="p-6 sm:p-8">
          <h3 className="text-lg font-semibold mb-6 dark:text-gray-200 text-gray-900">
            Portfolio & Social Links
          </h3>
          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="portfolio" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                Portfolio Website
              </label>
              <input
                id="portfolio"
                type="url"
                placeholder="https://yourportfolio.com"
                className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="linkedin" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                LinkedIn
              </label>
              <input
                id="linkedin"
                type="url"
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="github" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                GitHub
              </label>
              <input
                id="github"
                type="url"
                placeholder="https://github.com/yourusername"
                className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex flex-col sm:flex-row justify-end gap-4">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 rounded-xl text-sm font-medium border transition-colors dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 hover:bg-gray-50 dark:hover:bg-[rgba(108,166,205,0.1)]"
        >
          Cancel
        </button>
        <button
          className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-colors"
          style={{ backgroundColor: '#6CA6CD' }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(108, 166, 205, 0.9)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#6CA6CD';
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;

