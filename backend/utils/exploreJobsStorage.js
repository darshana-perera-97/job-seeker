const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const EXPLORE_JOBS_FILE = path.join(DATA_DIR, 'exploreJobs.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize exploreJobs.json if it doesn't exist
if (!fs.existsSync(EXPLORE_JOBS_FILE)) {
  fs.writeFileSync(EXPLORE_JOBS_FILE, JSON.stringify([], null, 2));
}

// Read all explore jobs
function getAllExploreJobs() {
  try {
    const data = fs.readFileSync(EXPLORE_JOBS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading explore jobs file:', error);
    return [];
  }
}

// Filter jobs based on user preferences
// Only returns jobs that match user's preferences. Returns empty array if no preferences set.
function filterJobsByPreferences(jobs, userRoles = [], userCountries = []) {
  if (!Array.isArray(jobs)) {
    return [];
  }

  // If no preferences set, return empty array (user must set preferences first)
  const hasRoles = userRoles && userRoles.length > 0;
  const hasCountries = userCountries && userCountries.length > 0;
  
  if (!hasRoles && !hasCountries) {
    return [];
  }

  const normalizeString = (str) => (str || '').toLowerCase().trim();

  return jobs.filter((job) => {
    const jobTitle = normalizeString(job.job || '');
    const jobCountry = normalizeString(job.country || '');

    // Check if job matches any preferred role
    const matchesRole = hasRoles
      ? userRoles.some(role => jobTitle.includes(normalizeString(role)))
      : false;

    // Check if job matches any preferred country
    const matchesCountry = hasCountries
      ? userCountries.some(country => jobCountry === normalizeString(country))
      : false;

    // Return jobs that match either role OR country (or both)
    return matchesRole || matchesCountry;
  });
}

module.exports = {
  getAllExploreJobs,
  filterJobsByPreferences,
  EXPLORE_JOBS_FILE,
};

