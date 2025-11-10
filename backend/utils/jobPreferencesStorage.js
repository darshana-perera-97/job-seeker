const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const JOB_PREFS_FILE = path.join(DATA_DIR, 'userJobPreferences.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize userJobPreferences.json if it doesn't exist
if (!fs.existsSync(JOB_PREFS_FILE)) {
  fs.writeFileSync(JOB_PREFS_FILE, JSON.stringify([], null, 2));
}

function getAllJobPreferences() {
  try {
    const data = fs.readFileSync(JOB_PREFS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading user job preferences file:', error);
    return [];
  }
}

function saveAllJobPreferences(preferences) {
  try {
    fs.writeFileSync(JOB_PREFS_FILE, JSON.stringify(preferences, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing user job preferences file:', error);
    return false;
  }
}

function findJobPreferencesByUserId(userId) {
  const allPrefs = getAllJobPreferences();
  return allPrefs.find((pref) => pref.userId === userId);
}

function upsertJobPreferences(userId, data) {
  const allPrefs = getAllJobPreferences();
  const index = allPrefs.findIndex((pref) => pref.userId === userId);

  const preference = {
    userId,
    roles: Array.isArray(data.roles) ? data.roles : [],
    countries: Array.isArray(data.countries) ? data.countries : [],
    updatedAt: data.updatedAt || new Date().toISOString(),
  };

  if (index === -1) {
    allPrefs.push(preference);
  } else {
    allPrefs[index] = preference;
  }

  if (saveAllJobPreferences(allPrefs)) {
    return { success: true, preference };
  }

  return { success: false, error: 'Failed to save job preferences' };
}

module.exports = {
  getAllJobPreferences,
  findJobPreferencesByUserId,
  upsertJobPreferences,
  JOB_PREFS_FILE,
};

