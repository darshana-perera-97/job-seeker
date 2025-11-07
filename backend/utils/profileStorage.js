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

function sanitizeAnalytics(analytics) {
  if (!analytics || typeof analytics !== 'object') {
    return undefined;
  }

  const allowedKeys = ['cvsCreated', 'jobsApplied', 'cvsSent', 'skillMatch'];
  const sanitized = {};

  allowedKeys.forEach((key) => {
    const entry = analytics[key];

    if (entry && typeof entry === 'object') {
      const sanitizedEntry = {};

      if (entry.value !== undefined && entry.value !== null) {
        const valueStr = String(entry.value).trim();
        if (valueStr.length > 0) {
          sanitizedEntry.value = valueStr;
        }
      }

        if (entry.trend !== undefined && entry.trend !== null) {
          const trendMatch = String(entry.trend).match(/-?\d+(?:\.\d+)?/);
          if (trendMatch) {
            const trendNumber = Number(trendMatch[0]);
            if (!Number.isNaN(trendNumber)) {
              sanitizedEntry.trend = Math.abs(trendNumber);
            }
          }
      }

      if (typeof entry.trendUp === 'boolean') {
        sanitizedEntry.trendUp = entry.trendUp;
      }

      if (Object.keys(sanitizedEntry).length > 0) {
        sanitized[key] = sanitizedEntry;
      }
    }
  });

  return Object.keys(sanitized).length > 0 ? sanitized : undefined;
}

function sanitizeWeeklyActivity(activity) {
  if (!Array.isArray(activity)) {
    return undefined;
  }

  const sanitized = activity
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return null;
      }

      const sanitizedItem = {};

      if (item.name !== undefined && item.name !== null) {
        const nameStr = String(item.name).trim();
        if (nameStr.length > 0) {
          sanitizedItem.name = nameStr;
        }
      }

      if (item.cvs !== undefined && item.cvs !== null && !Number.isNaN(Number(item.cvs))) {
        sanitizedItem.cvs = Number(item.cvs);
      }

      if (item.jobs !== undefined && item.jobs !== null && !Number.isNaN(Number(item.jobs))) {
        sanitizedItem.jobs = Number(item.jobs);
      }

      return Object.keys(sanitizedItem).length > 0 ? sanitizedItem : null;
    })
    .filter(Boolean);

  return sanitized.length > 0 ? sanitized : undefined;
}

function sanitizeRecentJobs(jobs) {
  if (!Array.isArray(jobs)) {
    return undefined;
  }

  const sanitized = jobs
    .map((job) => {
      if (!job || typeof job !== 'object') {
        return null;
      }

      const sanitizedJob = {};

      if (job.id !== undefined && job.id !== null) {
        const idStr = String(job.id).trim();
        if (idStr.length > 0) {
          sanitizedJob.id = idStr;
        }
      }

      if (job.title !== undefined && job.title !== null) {
        const titleStr = String(job.title).trim();
        if (titleStr.length > 0) {
          sanitizedJob.title = titleStr;
        }
      }

      if (job.company !== undefined && job.company !== null) {
        const companyStr = String(job.company).trim();
        if (companyStr.length > 0) {
          sanitizedJob.company = companyStr;
        }
      }

      if (job.appliedAt !== undefined && job.appliedAt !== null) {
        const appliedDate = new Date(job.appliedAt);
        if (!Number.isNaN(appliedDate.getTime())) {
          sanitizedJob.appliedAt = appliedDate.toISOString();
        }
      }

      if (!sanitizedJob.id) {
        sanitizedJob.id = `job-${Math.random().toString(36).slice(2, 10)}`;
      }

      return Object.keys(sanitizedJob).length > 1 ? sanitizedJob : null;
    })
    .filter(Boolean);

  return sanitized.length > 0 ? sanitized : undefined;
}

// Upsert profile data
function upsertProfile(userId, data) {
  const profiles = getAllProfiles();
  const profileIndex = profiles.findIndex(profile => profile.userId === userId);
  const timestamp = new Date().toISOString();

  const sanitizedPreferences = data.preferences && typeof data.preferences === 'object'
    ? data.preferences
    : undefined;

  const sanitizedSkills = Array.isArray(data.skills)
    ? data.skills
        .filter(skill => typeof skill === 'string')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0)
    : undefined;

  const sanitizedAnalytics = sanitizeAnalytics(data.analytics);

  const sanitizedWeeklyActivity = sanitizeWeeklyActivity(data.weeklyActivity);

  const sanitizedRecentJobs = sanitizeRecentJobs(data.recentJobs);

  const otherData = Object.keys(data).reduce((acc, key) => {
    if (key !== 'preferences' && key !== 'skills' && key !== 'analytics' && key !== 'weeklyActivity' && key !== 'recentJobs') {
      acc[key] = data[key];
    }
    return acc;
  }, {});

  if (profileIndex === -1) {
    const newProfile = {
      userId,
      ...otherData,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    newProfile.preferences = sanitizedPreferences ? { ...sanitizedPreferences } : {};
    newProfile.skills = sanitizedSkills ? Array.from(new Set(sanitizedSkills)) : [];

    if (sanitizedAnalytics) {
      newProfile.analytics = sanitizedAnalytics;
    }

    if (sanitizedWeeklyActivity) {
      newProfile.weeklyActivity = sanitizedWeeklyActivity;
    }

    if (sanitizedRecentJobs) {
      newProfile.recentJobs = sanitizedRecentJobs;
    }

    profiles.push(newProfile);
  } else {
    const existingProfile = profiles[profileIndex];
    const updatedProfile = {
      ...existingProfile,
      ...otherData,
      updatedAt: timestamp
    };

    if (sanitizedPreferences) {
      updatedProfile.preferences = {
        ...(existingProfile.preferences || {}),
        ...sanitizedPreferences
      };
    }

    if (sanitizedSkills) {
      updatedProfile.skills = Array.from(new Set(sanitizedSkills));
    }

    if (sanitizedAnalytics) {
      updatedProfile.analytics = {
        ...(existingProfile.analytics || {}),
        ...sanitizedAnalytics
      };
    }

    if (sanitizedWeeklyActivity) {
      updatedProfile.weeklyActivity = sanitizedWeeklyActivity;
    }

    if (sanitizedRecentJobs) {
      updatedProfile.recentJobs = sanitizedRecentJobs;
    }

    profiles[profileIndex] = updatedProfile;
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
  upsertProfile,
  sanitizeAnalytics,
  sanitizeWeeklyActivity,
  sanitizeRecentJobs
};

