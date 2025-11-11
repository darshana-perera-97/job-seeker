import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JobSelection from '../components/JobSelection';
import API_BASE_URL from '../utils/apiConfig';

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
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [skillsSaving, setSkillsSaving] = useState(false);
  const [skillsError, setSkillsError] = useState('');
  const [skillsMessage, setSkillsMessage] = useState('');
  const [jobPreferences, setJobPreferences] = useState({ roles: [], countries: [], skills: [] });
  const [jobPrefLoading, setJobPrefLoading] = useState(true);
  const [jobPrefSaving, setJobPrefSaving] = useState(false);
  const [jobPrefError, setJobPrefError] = useState('');
  const [jobPrefMessage, setJobPrefMessage] = useState('');

  const userId = user?.id;

  // Get user data from localStorage
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

  // Load skills from backend when user is available
  useEffect(() => {
    const fetchSkills = async () => {
      if (!userId) {
        return;
      }

      setSkillsLoading(true);
      setSkillsError('');

      try {
        const res = await fetch(`${API_BASE_URL}/api/profile/skills/${userId}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to load skills');
        }

        const fetchedSkills = Array.isArray(data.skills) ? data.skills : [];
        setSkills(fetchedSkills);
        setUser((prev) => {
          if (!prev) return prev;
          const prevSkills = Array.isArray(prev.skills) ? prev.skills : [];
          const isSameLength = prevSkills.length === fetchedSkills.length;
          const isSameSkills = isSameLength && prevSkills.every((skill, index) => skill === fetchedSkills[index]);

          if (isSameSkills) {
            return prev;
          }

          const updatedUser = { ...prev, skills: fetchedSkills };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          return updatedUser;
        });
      } catch (error) {
        console.error('Fetch skills error:', error);
        setSkillsError(error.message || 'Failed to load skills. Using cached data.');
      } finally {
        setSkillsLoading(false);
      }
    };

    fetchSkills();
  }, [userId]);

  useEffect(() => {
    const fetchJobPreferences = async () => {
      if (!userId) {
        setJobPrefLoading(false);
        return;
      }

      setJobPrefLoading(true);
      setJobPrefError('');

      try {
        const res = await fetch(`${API_BASE_URL}/api/job-preferences/${userId}`);
        const data = await res.json();

        if (res.ok && data.success && data.preference) {
          const roles = Array.isArray(data.preference.roles) ? data.preference.roles : [];
          const countries = Array.isArray(data.preference.countries) ? data.preference.countries : [];
          const skills = Array.isArray(data.preference.skills) ? data.preference.skills : [];
          setJobPreferences({ roles, countries, skills });
          localStorage.setItem('jobPreferences', JSON.stringify({
            roles,
            countries,
            skills,
            timestamp: data.preference.updatedAt || new Date().toISOString(),
          }));
        } else {
          setJobPreferences({ roles: [], countries: [], skills: [] });
        }
      } catch (error) {
        console.error('Fetch job preferences error:', error);
        setJobPrefError('Failed to load job preferences. Please try again later.');
      } finally {
        setJobPrefLoading(false);
      }
    };

    fetchJobPreferences();
  }, [userId]);

  const saveSkills = async (nextSkills, previousSkills) => {
    if (!userId) return false;

    setSkills(nextSkills);
    setSkillsSaving(true);
    setSkillsError('');
    setSkillsMessage('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/profile/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          skills: nextSkills
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update skills');
      }

      const updatedSkills = Array.isArray(data.skills) ? data.skills : nextSkills;
      setSkills(updatedSkills);
      setSkillsMessage('Skills updated');
      setTimeout(() => setSkillsMessage(''), 2000);

      setUser((prev) => {
        if (!prev) return prev;
        const prevSkills = Array.isArray(prev.skills) ? prev.skills : [];
        const isSameLength = prevSkills.length === updatedSkills.length;
        const isSameSkills = isSameLength && prevSkills.every((skill, index) => skill === updatedSkills[index]);

        if (isSameSkills) {
          return prev;
        }

        const updatedUser = { ...prev, skills: updatedSkills };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      });

      // Also update job preferences with the new skills
      try {
        const jobPrefRes = await fetch(`${API_BASE_URL}/api/job-preferences`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            roles: jobPreferences.roles,
            countries: jobPreferences.countries,
            skills: updatedSkills,
            updatedAt: new Date().toISOString(),
          }),
        });

        const jobPrefData = await jobPrefRes.json();
        if (jobPrefRes.ok && jobPrefData.success) {
          // Update local job preferences state
          setJobPreferences((prev) => ({
            ...prev,
            skills: updatedSkills,
          }));
          // Update localStorage
          localStorage.setItem('jobPreferences', JSON.stringify({
            roles: Array.isArray(jobPreferences.roles) ? jobPreferences.roles : [],
            countries: Array.isArray(jobPreferences.countries) ? jobPreferences.countries : [],
            skills: updatedSkills,
            timestamp: new Date().toISOString(),
          }));
        }
      } catch (error) {
        console.error('Error updating job preferences with skills:', error);
        // Don't fail the whole operation if job preferences update fails
      }

      return true;
    } catch (error) {
      console.error('Save skills error:', error);
      setSkills(previousSkills);
      setSkillsError(error.message || 'Failed to update skills. Please try again.');
      return false;
    } finally {
      setSkillsSaving(false);
    }
  };

  // Get first letter of full name
  const getFirstLetter = () => {
    if (!user) return 'U';
    if (user.fullName) {
      const trimmedName = user.fullName.trim();
      return trimmedName[0]?.toUpperCase() || 'U';
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  // Parse full name into first and last name
  const parseName = () => {
    if (!user?.fullName) return { firstName: '', lastName: '' };
    const names = user.fullName.trim().split(' ');
    if (names.length >= 2) {
      return {
        firstName: names[0],
        lastName: names.slice(1).join(' ')
      };
    }
    return {
      firstName: names[0] || '',
      lastName: ''
    };
  };

  const { firstName, lastName } = parseName();

  const handleAddSkill = async () => {
    const trimmedSkill = newSkill.trim();

    if (!trimmedSkill || skills.includes(trimmedSkill)) {
      return;
    }

    if (skillsSaving || skillsLoading) {
      return;
    }

    const previousSkills = skills;
    const nextSkills = [...skills, trimmedSkill];
    const success = await saveSkills(nextSkills, previousSkills);

    if (success) {
      setNewSkill('');
    }
  };

  const handleRemoveSkill = async (skillToRemove) => {
    if (skillsSaving || skillsLoading) {
      return;
    }

    const previousSkills = skills;
    const nextSkills = skills.filter((skill) => skill !== skillToRemove);
    await saveSkills(nextSkills, previousSkills);
  };

const handleJobPrefChange = (data) => {
  setJobPreferences(data);
};

  const handleSaveJobPreferences = async () => {
    if (!userId) return false;

    setJobPrefSaving(true);
    setJobPrefError('');
    setJobPrefMessage('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/job-preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          roles: jobPreferences.roles,
          countries: jobPreferences.countries,
          skills: skills.length > 0 ? skills : (Array.isArray(jobPreferences.skills) ? jobPreferences.skills : []),
          updatedAt: new Date().toISOString(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save job preferences');
      }

      setJobPrefMessage('Job preferences updated');
      setTimeout(() => setJobPrefMessage(''), 2000);
      localStorage.setItem('jobPreferences', JSON.stringify({
        roles: Array.isArray(jobPreferences.roles) ? jobPreferences.roles : [],
        countries: Array.isArray(jobPreferences.countries) ? jobPreferences.countries : [],
        skills: skills.length > 0 ? skills : (Array.isArray(jobPreferences.skills) ? jobPreferences.skills : []),
        timestamp: new Date().toISOString(),
      }));
      return true;
    } catch (error) {
      console.error('Save job preferences error:', error);
      setJobPrefError(error.message || 'Failed to update job preferences. Please try again.');
      return false;
    } finally {
      setJobPrefSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 dark:text-gray-400">Loading profile...</p>
      </div>
    );
  }

  const handleSaveAll = async () => {
    const jobPrefSaved = await handleSaveJobPreferences();
    if (!jobPrefSaved) {
      return;
    }
    navigate(-1);
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
      {(user.profilePicture || user.fullName || user.email) && (
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
                    background: user.profilePicture 
                      ? `url(${user.profilePicture})` 
                      : 'linear-gradient(to bottom right, #6CA6CD, #B2A5FF)',
                    backgroundSize: user.profilePicture ? 'cover' : 'auto',
                    backgroundPosition: 'center'
                  }}
                >
                  {!user.profilePicture && (
                    <span>{getFirstLetter()}</span>
                  )}
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
                {user.fullName && (
                  <h4 className="text-lg font-semibold mb-1 dark:text-gray-200 text-gray-900">
                    {user.fullName}
                  </h4>
                )}
                {user.email && (
                  <p className="text-sm sm:text-base dark:text-gray-400 text-gray-500 mb-3">
                    {user.email}
                  </p>
                )}
                <button
                  className="px-4 py-2 rounded-xl text-sm font-medium border transition-colors dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 hover:bg-gray-50 dark:hover:bg-[rgba(108,166,205,0.1)]"
                >
                  Change Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              {firstName && (
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    defaultValue={firstName}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
                  />
                </div>
              )}
              {lastName && (
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    defaultValue={lastName}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
                  />
                </div>
              )}
              {user.email && (
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    defaultValue={user.email}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
                  />
                </div>
              )}
              {user.phone && (
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    defaultValue={user.phone}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
                  />
                </div>
              )}
              {user.location && (
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="location" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                    Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    defaultValue={user.location}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
                  />
                </div>
              )}
              {user.bio && (
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="bio" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                    Professional Bio
                  </label>
                  <textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    defaultValue={user.bio}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-xl border min-h-32 transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50 resize-none"
                  />
                </div>
              )}
              {user.authProvider && (
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="authProvider" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                    Account Type
                  </label>
                  <input
                    id="authProvider"
                    type="text"
                    defaultValue={user.authProvider === 'google' ? 'Google Account' : 'Email Account'}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
                  />
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Job Preferences */}
      <div 
        className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)]"
      >
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold dark:text-gray-200 text-gray-900">
              Job Preferences
            </h3>
            <p className="text-sm dark:text-gray-400 text-gray-500">
              Choose the job roles and countries you&apos;re targeting to personalize recommendations.
            </p>
          </div>
          {(jobPrefError || jobPrefMessage) && (
            <div>
              {jobPrefError && (
                <div className="rounded-xl p-3 text-sm" style={{ 
                  backgroundColor: '#FEE2E2',
                  color: '#DC2626',
                  border: '1px solid #FCA5A5'
                }}>
                  {jobPrefError}
                </div>
              )}
              {jobPrefMessage && (
                <div className="rounded-xl p-3 text-sm" style={{ 
                  backgroundColor: '#D1FAE5',
                  color: '#065F46',
                  border: '1px solid #6EE7B7'
                }}>
                  {jobPrefMessage}
                </div>
              )}
            </div>
          )}

          {jobPrefLoading ? (
            <p className="text-sm dark:text-gray-400 text-gray-500">
              Loading job preferences...
            </p>
          ) : (
            <JobSelection
              key={`${jobPreferences.roles.join(',')}-${jobPreferences.countries.join(',')}`}
              initialRoles={jobPreferences.roles}
              initialCountries={jobPreferences.countries}
              onDataChange={handleJobPrefChange}
            />
          )}
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
          {skillsLoading ? (
            <p className="text-sm dark:text-gray-400 text-gray-500">
              Loading skills...
            </p>
          ) : skills.length === 0 ? (
            <p className="text-sm dark:text-gray-400 text-gray-500 mb-4">
              No skills added yet. Add your skills below.
            </p>
          ) : null}

          {(skillsError || skillsMessage) && (
            <div className="mb-4">
              {skillsError && (
                <div className="rounded-xl p-3 text-sm" style={{ 
                  backgroundColor: '#FEE2E2',
                  color: '#DC2626',
                  border: '1px solid #FCA5A5'
                }}>
                  {skillsError}
                </div>
              )}
              {skillsMessage && (
                <div className="rounded-xl p-3 text-sm" style={{ 
                  backgroundColor: '#D1FAE5',
                  color: '#065F46',
                  border: '1px solid #6EE7B7'
                }}>
                  {skillsMessage}
                </div>
              )}
            </div>
          )}

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
                    className="hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ color: '#6CA6CD' }}
                    disabled={skillsSaving || skillsLoading}
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
                disabled={skillsSaving || skillsLoading}
                className="flex-1 px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2.5 rounded-xl text-white transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: skillsSaving || skillsLoading ? 'rgba(108, 166, 205, 0.7)' : '#6CA6CD' }}
                onMouseEnter={(e) => {
                  if (!skillsSaving && !skillsLoading) {
                    e.target.style.backgroundColor = 'rgba(108, 166, 205, 0.9)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!skillsSaving && !skillsLoading) {
                    e.target.style.backgroundColor = '#6CA6CD';
                  }
                }}
                disabled={skillsSaving || skillsLoading}
              >
                {skillsSaving ? 'Saving...' : <PlusIcon className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Links */}
      {(user.portfolio || user.linkedin || user.github) && (
        <div 
          className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)]"
        >
          <div className="p-6 sm:p-8">
            <h3 className="text-lg font-semibold mb-6 dark:text-gray-200 text-gray-900">
              Portfolio & Social Links
            </h3>
            <div className="space-y-5">
              {user.portfolio && (
                <div className="space-y-2">
                  <label htmlFor="portfolio" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                    Portfolio Website
                  </label>
                  <input
                    id="portfolio"
                    type="url"
                    defaultValue={user.portfolio}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
                  />
                </div>
              )}
              {user.linkedin && (
                <div className="space-y-2">
                  <label htmlFor="linkedin" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                    LinkedIn
                  </label>
                  <input
                    id="linkedin"
                    type="url"
                    defaultValue={user.linkedin}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
                  />
                </div>
              )}
              {user.github && (
                <div className="space-y-2">
                  <label htmlFor="github" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                    GitHub
                  </label>
                  <input
                    id="github"
                    type="url"
                    defaultValue={user.github}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex flex-col sm:flex-row justify-end gap-4">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 rounded-xl text-sm font-medium border transition-colors dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 hover:bg-gray-50 dark:hover:bg-[rgba(108,166,205,0.1)]"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveAll}
          disabled={jobPrefSaving || jobPrefLoading}
          className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: jobPrefSaving || jobPrefLoading ? 'rgba(108, 166, 205, 0.7)' : '#6CA6CD' }}
          onMouseEnter={(e) => {
            if (!jobPrefSaving && !jobPrefLoading) {
              e.target.style.backgroundColor = 'rgba(108, 166, 205, 0.9)';
            }
          }}
          onMouseLeave={(e) => {
            if (!jobPrefSaving && !jobPrefLoading) {
              e.target.style.backgroundColor = '#6CA6CD';
            }
          }}
        >
          {jobPrefSaving || jobPrefLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;

