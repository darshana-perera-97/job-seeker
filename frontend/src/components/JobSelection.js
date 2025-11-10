import { useState, useEffect } from 'react';

function JobSelection({ initialRoles = [], initialCountries = [], onDataChange }) {
  const [selectedRoles, setSelectedRoles] = useState(initialRoles);
  const [selectedCountries, setSelectedCountries] = useState(initialCountries);
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

  // Load custom roles from initial roles that aren't in the default list
  useEffect(() => {
    const custom = initialRoles.filter(role => !jobRoles.includes(role));
    setCustomRoles(custom);
  }, []);

  // Notify parent of changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange({
        roles: selectedRoles,
        countries: selectedCountries,
      });
    }
  }, [selectedRoles, selectedCountries, onDataChange]);

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

  return (
    <div className="space-y-8">
      {/* Job Roles Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Select Your Job Roles
          </h3>
          <span className="text-sm text-gray-500">
            {selectedRoles.length}/{MAX_ROLES} selected
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {allRoles.map((role) => {
            const isSelected = selectedRoles.includes(role);
            const isDisabled = !isSelected && selectedRoles.length >= MAX_ROLES;
            return (
              <button
                key={role}
                type="button"
                onClick={() => toggleRole(role)}
                disabled={isDisabled}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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
              className="flex-1 px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
            />
            <button
              type="button"
              onClick={handleAddCustomRole}
              disabled={!customRoleInput.trim() || selectedRoles.length >= MAX_ROLES}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Select Target Countries
          </h3>
          <span className="text-sm text-gray-500">
            {selectedCountries.length}/{MAX_COUNTRIES} selected
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {countries.map((country) => {
            const isSelected = selectedCountries.includes(country);
            const isDisabled = !isSelected && selectedCountries.length >= MAX_COUNTRIES;
            return (
              <button
                key={country}
                type="button"
                onClick={() => toggleCountry(country)}
                disabled={isDisabled}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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
    </div>
  );
}

export default JobSelection;

