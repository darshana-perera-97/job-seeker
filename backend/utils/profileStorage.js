const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const PROFILE_FILE = path.join(DATA_DIR, 'profileData.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize profileData.json if it doesn't exist
if (!fs.existsSync(PROFILE_FILE)) {
  fs.writeFileSync(PROFILE_FILE, JSON.stringify([], null, 2));
}

// Read all profiles
function getAllProfiles() {
  try {
    const data = fs.readFileSync(PROFILE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading profile data file:', error);
    return [];
  }
}

// Save all profiles
function saveAllProfiles(profiles) {
  try {
    fs.writeFileSync(PROFILE_FILE, JSON.stringify(profiles, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing profile data file:', error);
    return false;
  }
}

// Find profile by user ID
function findProfileByUserId(userId) {
  const profiles = getAllProfiles();
  return profiles.find(profile => profile.userId === userId) || null;
}

// Upsert profile data
function upsertProfile(userId, data) {
  const profiles = getAllProfiles();
  const profileIndex = profiles.findIndex(profile => profile.userId === userId);
  const timestamp = new Date().toISOString();

  if (profileIndex === -1) {
    const newProfile = {
      userId,
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    profiles.push(newProfile);
  } else {
    profiles[profileIndex] = {
      ...profiles[profileIndex],
      ...data,
      updatedAt: timestamp
    };
  }

  if (saveAllProfiles(profiles)) {
    return { success: true, profile: findProfileByUserId(userId) };
  }

  return { success: false, error: 'Failed to save profile data' };
}

module.exports = {
  getAllProfiles,
  saveAllProfiles,
  findProfileByUserId,
  upsertProfile
};

