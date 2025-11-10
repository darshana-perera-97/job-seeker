import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function JobSelectionSection() {
  const navigate = useNavigate();
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [customRoles, setCustomRoles] = useState([]);
  const [customRoleInput, setCustomRoleInput] = useState('');

  const MAX_ROLES = 4;
  const MAX_COUNTRIES = 6;

  const jobRoles = [
    'Software Developer',
    'Data Scientist',
    'Product Manager',
    'UX Designer',
    'Marketing Manager',
    'Sales Executive',
    'Business Analyst',
    'DevOps Engineer',
    'QA Engineer',
    'Project Manager',
  ];

  const countries = [
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'Germany',
    'France',
    'Netherlands',
    'Sweden',
    'Singapore',
    'Japan',
    'Remote',
  ];

  const allRoles = [...jobRoles, ...customRoles];

  const toggleRole = (role) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles((prev) => prev.filter((r) => r !== role));
    } else if (selectedRoles.length < MAX_ROLES) {
      setSelectedRoles((prev) => [...prev, role]);
    }
  };

  const toggleCountry = (country) => {
    if (selectedCountries.includes(country)) {
      setSelectedCountries((prev) => prev.filter((c) => c !== country));
    } else if (selectedCountries.length < MAX_COUNTRIES) {
      setSelectedCountries((prev) => [...prev, country]);
    }
  };

  const handleAddCustomRole = () => {
    const trimmedRole = customRoleInput.trim();
    if (
      trimmedRole &&
      !allRoles.includes(trimmedRole) &&
      selectedRoles.length < MAX_ROLES
    ) {
      setCustomRoles((prev) => [...prev, trimmedRole]);
      setSelectedRoles((prev) => [...prev, trimmedRole]);
      setCustomRoleInput('');
    }
  };

  const handleCustomRoleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomRole();
    }
  };

  const handleViewJobs = () => {
    const jobPreferences = {
      roles: selectedRoles,
      countries: selectedCountries,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem('jobPreferences', JSON.stringify(jobPreferences));
    navigate('/signup');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Select Your Job Preferences
        </h2>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Choose your preferred job roles and target countries to get started
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Job Roles Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Select Your Job Roles
            </h3>
            <span className="text-sm text-gray-500">
              {selectedRoles.length}/{MAX_ROLES} selected
            </span>
          </div>
          <div className="flex flex-wrap gap-3 mb-4">
            {allRoles.map((role) => {
              const isSelected = selectedRoles.includes(role);
              const isDisabled = !isSelected && selectedRoles.length >= MAX_ROLES;
              return (
                <button
                  key={role}
                  onClick={() => toggleRole(role)}
                  disabled={isDisabled}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    isSelected
                      ? 'bg-gray-900 text-white border-2 border-gray-900'
                      : isDisabled
                      ? 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed'
                      : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {role}
                </button>
              );
            })}
          </div>
          {selectedRoles.length < MAX_ROLES && (
            <div className="flex gap-2">
              <input
                type="text"
                value={customRoleInput}
                onChange={(e) => setCustomRoleInput(e.target.value)}
                onKeyPress={handleCustomRoleKeyPress}
                placeholder="Add custom job role..."
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
              />
              <button
                onClick={handleAddCustomRole}
                disabled={!customRoleInput.trim() || selectedRoles.length >= MAX_ROLES}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  !customRoleInput.trim() || selectedRoles.length >= MAX_ROLES
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* Target Countries Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Select Target Countries
            </h3>
            <span className="text-sm text-gray-500">
              {selectedCountries.length}/{MAX_COUNTRIES} selected
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {countries.map((country) => {
              const isSelected = selectedCountries.includes(country);
              const isDisabled = !isSelected && selectedCountries.length >= MAX_COUNTRIES;
              return (
                <button
                  key={country}
                  onClick={() => toggleCountry(country)}
                  disabled={isDisabled}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    isSelected
                      ? 'bg-gray-900 text-white border-2 border-gray-900'
                      : isDisabled
                      ? 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed'
                      : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {country}
                </button>
              );
            })}
          </div>
        </div>

        {/* View Jobs Button */}
        <div className="flex justify-center pt-6">
          <button
            onClick={handleViewJobs}
            disabled={selectedRoles.length === 0 || selectedCountries.length === 0}
            className={`px-8 py-3 rounded-lg font-medium transition-all ${
              selectedRoles.length === 0 || selectedCountries.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm'
            }`}
          >
            View Jobs
          </button>
        </div>
      </div>
    </section>
  );
}

export default JobSelectionSection;

