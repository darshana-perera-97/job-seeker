const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { findUserByEmail, addUser, findUserById, updateUser } = require('./utils/userStorage');
const { findProfileByUserId, upsertProfile, sanitizeWeeklyActivity, sanitizeRecentJobs } = require('./utils/profileStorage');
const { findCVsByUserId, addCV, deleteCV, getCVFilePath, findCVById, CV_DIR } = require('./utils/cvStorage');
const { findCVDataByUserId, upsertCVData } = require('./utils/cvDataStorage');
const { getAllJobs } = require('./utils/jobStorage');
const { getAllJobPreferences, findJobPreferencesByUserId, upsertJobPreferences } = require('./utils/jobPreferencesStorage');
const { findAppliedJobsByUserId, addAppliedJob } = require('./utils/appliedJobsStorage');
const { getAllExploreJobs, filterJobsByPreferences } = require('./utils/exploreJobsStorage');

const defaultPreferences = {
  emailNotifications: true,
  jobRecommendations: true,
  applicationUpdates: true,
  marketingEmails: false
};

const defaultAnalytics = {
  cvsCreated: {
    value: '0',
    trend: 0,
    trendUp: true
  },
  jobsApplied: {
    value: '0',
    trend: 0,
    trendUp: true
  },
  cvsSent: {
    value: '0',
    trend: 0,
    trendUp: true
  },
  skillMatch: {
    value: '0%',
    trend: 0,
    trendUp: true
  }
};

const defaultWeeklyActivity = [
  { name: 'Mon', cvs: 0, jobs: 0 },
  { name: 'Tue', cvs: 0, jobs: 0 },
  { name: 'Wed', cvs: 0, jobs: 0 },
  { name: 'Thu', cvs: 0, jobs: 0 },
  { name: 'Fri', cvs: 0, jobs: 0 },
  { name: 'Sat', cvs: 0, jobs: 0 },
  { name: 'Sun', cvs: 0, jobs: 0 }
];

const defaultRecentJobs = [
  {
    id: 'job-1',
    title: 'Senior Developer',
    company: 'TechCorp',
    appliedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'job-2',
    title: 'Frontend Engineer',
    company: 'Startup Inc',
    appliedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'job-3',
    title: 'UI/UX Designer',
    company: 'Creative Studio',
    appliedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'job-4',
    title: 'Product Manager',
    company: 'Innovate Labs',
    appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

function normalizeRecentJobsData(jobs) {
  const sanitized = sanitizeRecentJobs(jobs) || [];

  const normalized = sanitized.map((job, index) => {
    const appliedDate = new Date(job.appliedAt);
    const appliedAt = !Number.isNaN(appliedDate.getTime())
      ? appliedDate.toISOString()
      : new Date().toISOString();

    return {
      id: job.id || `job-${index}`,
      title: job.title || 'Job Title',
      company: job.company || 'Company',
      appliedAt
    };
  });

  return normalized.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure CV directory exists
    if (!fs.existsSync(CV_DIR)) {
      fs.mkdirSync(CV_DIR, { recursive: true });
    }
    cb(null, CV_DIR);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: timestamp-random-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${uniqueSuffix}-${name}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only PDF, DOC, DOCX
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || 
                     file.mimetype === 'application/pdf' ||
                     file.mimetype === 'application/msword' ||
                     file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
  }
});

// API Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Job Seeker API',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Password validation (minimum 6 characters)
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user object
    const userData = {
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      authProvider: 'email' // Regular email/password signup
    };

    // Add user to storage
    const result = addUser(userData);

    if (result.success) {
      // Remove password from response
      const { password: _, ...userWithoutPassword } = result.user;
      
      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        user: userWithoutPassword
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error || 'Failed to create user'
      });
    }
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Google Signup endpoint
app.post('/api/signup/google', async (req, res) => {
  try {
    const { fullName, email, googleId, profilePicture } = req.body;

    // Validation
    if (!fullName || !email || !googleId) {
      return res.status(400).json({
        success: false,
        error: 'Full name, email, and Google ID are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Check if user already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      // User exists, return success (they can proceed to login)
      const { password: _, ...userWithoutPassword } = existingUser;
      return res.status(200).json({
        success: true,
        message: 'User already exists',
        user: userWithoutPassword,
        isExisting: true
      });
    }

    // Create user object for Google signup
    const userData = {
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      googleId: googleId,
      profilePicture: profilePicture || null,
      authProvider: 'google' // Google OAuth signup
    };

    // Add user to storage
    const result = addUser(userData);

    if (result.success) {
      // Remove password from response (if exists)
      const { password: _, ...userWithoutPassword } = result.user;
      
      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        user: userWithoutPassword,
        isExisting: false
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error || 'Failed to create user'
      });
    }
  } catch (error) {
    console.error('Google signup error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user by email
    const user = findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check if user has a password (email/password users)
    if (!user.password) {
      return res.status(401).json({
        success: false,
        error: 'This account was created with Google. Please use Google Sign-In.'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Google Login endpoint
app.post('/api/login/google', async (req, res) => {
  try {
    const { email, googleId } = req.body;

    // Validation
    if (!email || !googleId) {
      return res.status(400).json({
        success: false,
        error: 'Email and Google ID are required'
      });
    }

    // Find user by email
    const user = findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'No account found with this email. Please sign up first.'
      });
    }

    // Verify Google ID matches
    if (user.googleId !== googleId) {
      return res.status(401).json({
        success: false,
        error: 'Google authentication failed'
      });
    }

    // Remove password from response (if exists)
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Change Password endpoint
app.post('/api/change-password', async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    // Validation
    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'User ID, current password, and new password are required'
      });
    }

    // Password validation (minimum 6 characters)
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 6 characters long'
      });
    }

    // Find user by ID
    const user = findUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if user has a password (email/password users only)
    if (!user.password) {
      return res.status(400).json({
        success: false,
        error: 'This account was created with Google. Password change is not available for Google accounts.'
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // Check if new password is different from current password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        error: 'New password must be different from current password'
      });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user password
    const result = updateUser(userId, { password: hashedPassword });

    if (result.success) {
      // Remove password from response
      const { password: _, ...userWithoutPassword } = result.user;
      
      return res.status(200).json({
        success: true,
        message: 'Password updated successfully',
        user: userWithoutPassword
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error || 'Failed to update password'
      });
    }
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get profile preferences endpoint
app.get('/api/profile/preferences/:userId', (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const profile = findProfileByUserId(userId);

    if (!profile || !profile.preferences) {
      return res.status(200).json({
        success: true,
        preferences: defaultPreferences,
        isDefault: true
      });
    }

    return res.status(200).json({
      success: true,
      preferences: {
        ...defaultPreferences,
        ...profile.preferences
      },
      isDefault: false
    });
  } catch (error) {
    console.error('Get profile preferences error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Update profile preferences endpoint
app.post('/api/profile/preferences', (req, res) => {
  try {
    const { userId, preferences } = req.body;

    if (!userId || !preferences) {
      return res.status(400).json({
        success: false,
        error: 'User ID and preferences are required'
      });
    }

    const allowedKeys = ['emailNotifications', 'jobRecommendations', 'applicationUpdates', 'marketingEmails'];
    const sanitizedPreferences = {};

    allowedKeys.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(preferences, key)) {
        sanitizedPreferences[key] = Boolean(preferences[key]);
      }
    });

    const result = upsertProfile(userId, {
      preferences: sanitizedPreferences
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Preferences updated successfully',
        preferences: {
          emailNotifications: true,
          jobRecommendations: true,
          applicationUpdates: true,
          marketingEmails: false,
          ...result.profile.preferences
        }
      });
    }

    return res.status(500).json({
      success: false,
      error: result.error || 'Failed to update preferences'
    });
  } catch (error) {
    console.error('Update profile preferences error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get profile analytics endpoint
app.get('/api/profile/analytics/:userId', (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const profile = findProfileByUserId(userId);

    if (!profile || !profile.analytics) {
      return res.status(200).json({
        success: true,
        analytics: defaultAnalytics,
        isDefault: true
      });
    }

    const mergedAnalytics = Object.keys(defaultAnalytics).reduce((acc, key) => {
      const defaultEntry = defaultAnalytics[key];
      const profileEntry = profile.analytics[key] || {};
      const profileTrend = profileEntry.trend;
      const trendNumber = profileTrend !== undefined && profileTrend !== null && !Number.isNaN(Number(profileTrend))
        ? Math.abs(Number(profileTrend))
        : defaultEntry.trend;

      acc[key] = {
        value: profileEntry.value !== undefined ? String(profileEntry.value) : defaultEntry.value,
        trend: trendNumber,
        trendUp: typeof profileEntry.trendUp === 'boolean' ? profileEntry.trendUp : defaultEntry.trendUp
      };

      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      analytics: mergedAnalytics,
      isDefault: false
    });
  } catch (error) {
    console.error('Get profile analytics error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Update profile analytics endpoint
app.post('/api/profile/analytics', (req, res) => {
  try {
    const { userId, analytics } = req.body;

    if (!userId || !analytics || typeof analytics !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'User ID and analytics data are required'
      });
    }

    const result = upsertProfile(userId, {
      analytics
    });

    if (result.success) {
      const profileAnalytics = result.profile.analytics || {};

      const mergedAnalytics = Object.keys(defaultAnalytics).reduce((acc, key) => {
        const defaultEntry = defaultAnalytics[key];
        const profileEntry = profileAnalytics[key] || {};
        const profileTrend = profileEntry.trend;
        const trendNumber = profileTrend !== undefined && profileTrend !== null && !Number.isNaN(Number(profileTrend))
          ? Math.abs(Number(profileTrend))
          : defaultEntry.trend;

        acc[key] = {
          value: profileEntry.value !== undefined ? String(profileEntry.value) : defaultEntry.value,
          trend: trendNumber,
          trendUp: typeof profileEntry.trendUp === 'boolean' ? profileEntry.trendUp : defaultEntry.trendUp
        };

        return acc;
      }, {});

      return res.status(200).json({
        success: true,
        message: 'Analytics updated successfully',
        analytics: mergedAnalytics
      });
    }

    return res.status(500).json({
      success: false,
      error: result.error || 'Failed to update analytics'
    });
  } catch (error) {
    console.error('Update profile analytics error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get weekly activity endpoint
app.get('/api/profile/activity/:userId', (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const profile = findProfileByUserId(userId);
    const sanitized = sanitizeWeeklyActivity(profile?.weeklyActivity);

    if (!sanitized) {
      return res.status(200).json({
        success: true,
        weeklyActivity: defaultWeeklyActivity,
        isDefault: true
      });
    }

    const mergedWeeklyActivity = defaultWeeklyActivity.map((day) => {
      const match = sanitized.find((item) =>
        item.name && item.name.toLowerCase() === day.name.toLowerCase()
      );

      return {
        name: match?.name || day.name,
        cvs: typeof match?.cvs === 'number' ? match.cvs : day.cvs,
        jobs: typeof match?.jobs === 'number' ? match.jobs : day.jobs
      };
    });

    return res.status(200).json({
      success: true,
      weeklyActivity: mergedWeeklyActivity,
      isDefault: false
    });
  } catch (error) {
    console.error('Get profile activity error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Update weekly activity endpoint
app.post('/api/profile/activity', (req, res) => {
  try {
    const { userId, weeklyActivity } = req.body;

    if (!userId || !weeklyActivity) {
      return res.status(400).json({
        success: false,
        error: 'User ID and weekly activity data are required'
      });
    }

    const sanitized = sanitizeWeeklyActivity(weeklyActivity);

    if (!sanitized) {
      return res.status(400).json({
        success: false,
        error: 'Invalid weekly activity data'
      });
    }

    const result = upsertProfile(userId, {
      weeklyActivity: sanitized
    });

    if (result.success) {
      const profileWeeklyActivity = sanitizeWeeklyActivity(result.profile.weeklyActivity) || defaultWeeklyActivity;

      const mergedWeeklyActivity = defaultWeeklyActivity.map((day) => {
        const match = profileWeeklyActivity.find((item) =>
          item.name && item.name.toLowerCase() === day.name.toLowerCase()
        );

        return {
          name: match?.name || day.name,
          cvs: typeof match?.cvs === 'number' ? match.cvs : day.cvs,
          jobs: typeof match?.jobs === 'number' ? match.jobs : day.jobs
        };
      });

      return res.status(200).json({
        success: true,
        message: 'Weekly activity updated successfully',
        weeklyActivity: mergedWeeklyActivity
      });
    }

    return res.status(500).json({
      success: false,
      error: result.error || 'Failed to update weekly activity'
    });
  } catch (error) {
    console.error('Update profile activity error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get recent jobs endpoint
app.get('/api/profile/recent-jobs/:userId', (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const profile = findProfileByUserId(userId);
    const sanitized = sanitizeRecentJobs(profile?.recentJobs);

    if (!sanitized) {
      return res.status(200).json({
        success: true,
        recentJobs: defaultRecentJobs,
        isDefault: true
      });
    }

    const normalized = normalizeRecentJobsData(sanitized);

    return res.status(200).json({
      success: true,
      recentJobs: normalized,
      isDefault: false
    });
  } catch (error) {
    console.error('Get recent jobs error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Update recent jobs endpoint
app.post('/api/profile/recent-jobs', (req, res) => {
  try {
    const { userId, recentJobs } = req.body;

    if (!userId || !recentJobs) {
      return res.status(400).json({
        success: false,
        error: 'User ID and recent jobs data are required'
      });
    }

    const sanitized = sanitizeRecentJobs(recentJobs);

    if (!sanitized) {
      return res.status(400).json({
        success: false,
        error: 'Invalid recent jobs data'
      });
    }

    const result = upsertProfile(userId, {
      recentJobs: sanitized
    });

    if (result.success) {
      const normalized = normalizeRecentJobsData(result.profile.recentJobs || []);

      return res.status(200).json({
        success: true,
        message: 'Recent jobs updated successfully',
        recentJobs: normalized
      });
    }

    return res.status(500).json({
      success: false,
      error: result.error || 'Failed to update recent jobs'
    });
  } catch (error) {
    console.error('Update recent jobs error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get profile skills endpoint
app.get('/api/profile/skills/:userId', (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const profile = findProfileByUserId(userId);

    if (!profile || !Array.isArray(profile.skills)) {
      return res.status(200).json({
        success: true,
        skills: []
      });
    }

    return res.status(200).json({
      success: true,
      skills: profile.skills
    });
  } catch (error) {
    console.error('Get profile skills error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Update profile skills endpoint
app.post('/api/profile/skills', (req, res) => {
  try {
    const { userId, skills } = req.body;

    if (!userId || !Array.isArray(skills)) {
      return res.status(400).json({
        success: false,
        error: 'User ID and skills array are required'
      });
    }

    const sanitizedSkills = skills
      .filter(skill => typeof skill === 'string')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);

    const result = upsertProfile(userId, {
      skills: sanitizedSkills
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Skills updated successfully',
        skills: result.profile.skills || []
      });
    }

    return res.status(500).json({
      success: false,
      error: result.error || 'Failed to update skills'
    });
  } catch (error) {
    console.error('Update profile skills error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// CV Upload endpoint
app.post('/api/cv/upload', upload.single('cvFile'), (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      // Clean up uploaded file if validation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // Verify user exists
    const user = findUserById(userId);
    if (!user) {
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check CV upload limit (max 3 CVs per user)
    const existingCVs = findCVsByUserId(userId);
    if (existingCVs.length >= 3) {
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        error: 'Maximum CV upload limit reached. You can only upload 3 CVs. Please delete an existing CV to upload a new one.'
      });
    }

    // Get CV name from request body (default to original filename if not provided)
    const cvName = req.body.cvName || req.file.originalname.replace(/\.[^/.]+$/, '');
    const isCreated = req.body.isCreated === 'true' || req.body.isCreated === true;

    // Save CV metadata
    const cvData = {
      userId: userId,
      fileName: req.file.filename,
      originalFileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      filePath: req.file.path,
      cvName: cvName.trim(),
      isCreated: isCreated,
    };

    const result = addCV(cvData);

    if (result.success) {
      // Remove filePath from response for security
      const { filePath, ...cvResponse } = result.cv;
      return res.status(201).json({
        success: true,
        message: 'CV uploaded successfully',
        cv: cvResponse
      });
    } else {
      // Clean up uploaded file if save fails
      fs.unlinkSync(req.file.path);
      return res.status(500).json({
        success: false,
        error: result.error || 'Failed to save CV'
      });
    }
  } catch (error) {
    console.error('CV upload error:', error);
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get user's CVs
app.get('/api/cv/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const cvs = findCVsByUserId(userId);

    // Remove filePath from response for security
    const cvsResponse = cvs.map(cv => {
      const { filePath, ...cvWithoutPath } = cv;
      return cvWithoutPath;
    });

    return res.json({
      success: true,
      cvs: cvsResponse
    });
  } catch (error) {
    console.error('Get CVs error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Preview CV file (inline display)
app.get('/api/cv/:cvId/preview', (req, res) => {
  try {
    const { cvId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const filePath = getCVFilePath(cvId, userId);

    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'CV file not found'
      });
    }

    // Get CV metadata for content type
    const cv = findCVById(cvId);
    const contentType = cv?.fileType || 'application/pdf';

    // Set headers for inline display
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', 'inline; filename="' + (cv?.originalFileName || 'cv.pdf') + '"');
    
    // Send file for preview
    res.sendFile(path.resolve(filePath), (err) => {
      if (err) {
        console.error('Preview error:', err);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            error: 'Failed to preview file'
          });
        }
      }
    });
  } catch (error) {
    console.error('Preview CV error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Download CV file
app.get('/api/cv/:cvId/download', (req, res) => {
  try {
    const { cvId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const filePath = getCVFilePath(cvId, userId);

    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'CV file not found'
      });
    }

    // Get original filename for download
    const cv = findCVById(cvId);
    const originalFileName = cv ? cv.originalFileName : 'cv.pdf';

    res.download(filePath, originalFileName, (err) => {
      if (err) {
        console.error('Download error:', err);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            error: 'Failed to download file'
          });
        }
      }
    });
  } catch (error) {
    console.error('Download CV error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get CV personal details by user ID
app.get('/api/cv-data/:userId', (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const cvData = findCVDataByUserId(userId);

    if (cvData) {
      return res.json({
        success: true,
        cvData: cvData
      });
    } else {
      return res.json({
        success: true,
        cvData: null
      });
    }
  } catch (error) {
    console.error('Get CV data error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Save/Update CV data (personal details and/or CV content)
app.post('/api/cv-data', (req, res) => {
  try {
    const { userId, personalDetails, cvContent } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    if (!personalDetails && !cvContent) {
      return res.status(400).json({
        success: false,
        error: 'Either personal details or CV content is required'
      });
    }

    const result = upsertCVData(userId, { personalDetails, cvContent });

    if (result.success) {
      return res.json({
        success: true,
        message: 'CV data saved successfully',
        cvData: result.cvData
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error || 'Failed to save CV data'
      });
    }
  } catch (error) {
    console.error('Save CV data error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Jobs endpoint
app.get('/api/jobs', (req, res) => {
  try {
    const jobs = getAllJobs();
    return res.json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to load jobs',
    });
  }
});

// Explore Jobs endpoint - filtered by user preferences
// IMPORTANT: This route must be defined before /api/job-preferences to avoid conflicts
// Backend processes and filters data before sending to frontend
app.get('/api/explore-jobs/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`[Explore Jobs] Request received for userId: ${userId}`);

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }

    // Step 1: Get all explore jobs from JSON file
    const allJobs = getAllExploreJobs();
    console.log(`[Explore Jobs] Step 1 - Loaded ${allJobs.length} total jobs from database`);

    // Step 2: Get user preferences
    const preference = findJobPreferencesByUserId(userId);
    const userRoles = Array.isArray(preference?.roles) ? preference.roles : [];
    const userCountries = Array.isArray(preference?.countries) ? preference.countries : [];
    
    console.log(`[Explore Jobs] Step 2 - User preferences loaded:`);
    console.log(`  - Roles (${userRoles.length}):`, userRoles);
    console.log(`  - Countries (${userCountries.length}):`, userCountries);

    // Step 3: Process and filter jobs based on user preferences
    // This filtering happens on the backend - only filtered results are sent to frontend
    const filteredJobs = filterJobsByPreferences(allJobs, userRoles, userCountries);
    console.log(`[Explore Jobs] Step 3 - Filtered ${allJobs.length} jobs down to ${filteredJobs.length} matching jobs`);
    console.log(`[Explore Jobs] Step 4 - Sending only filtered jobs to frontend`);

    // Step 4: Send only the filtered jobs to frontend
    return res.json({
      success: true,
      jobs: filteredJobs, // Only filtered jobs are sent, not all jobs
      totalJobs: allJobs.length,
      filteredCount: filteredJobs.length,
      hasPreferences: userRoles.length > 0 || userCountries.length > 0
    });
  } catch (error) {
    console.error('[Explore Jobs] Error processing jobs:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to load explore jobs',
    });
  }
});

// User job preferences
app.get('/api/job-preferences/:userId', (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }

    const preference = findJobPreferencesByUserId(userId);
    return res.json({
      success: true,
      preference: preference || null,
    });
  } catch (error) {
    console.error('Get job preferences error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to load job preferences',
    });
  }
});

app.post('/api/job-preferences', (req, res) => {
  try {
    const { userId, roles, countries, skills, updatedAt } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }

    const result = upsertJobPreferences(userId, { roles, countries, skills, updatedAt });
    if (result.success) {
      return res.json({
        success: true,
        preference: result.preference,
      });
    }

    return res.status(500).json({
      success: false,
      error: result.error || 'Failed to save job preferences',
    });
  } catch (error) {
    console.error('Save job preferences error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to save job preferences',
    });
  }
});

// Applied jobs
app.get('/api/applied-jobs/:userId', (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }

    const record = findAppliedJobsByUserId(userId);
    const jobs = record && Array.isArray(record.jobs) ? record.jobs : [];

    return res.json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error('Get applied jobs error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to load applied jobs',
    });
  }
});

app.post('/api/applied-jobs', (req, res) => {
  try {
    const { userId } = req.body || {};
    const jobPayload = req.body?.job || req.body || {};

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }

    const jobId =
      jobPayload?.jobId !== undefined && jobPayload?.jobId !== null
        ? String(jobPayload.jobId)
        : jobPayload?.id !== undefined && jobPayload?.id !== null
        ? String(jobPayload.id)
        : null;

    const jobTitle =
      typeof jobPayload.jobTitle === 'string'
        ? jobPayload.jobTitle
        : typeof jobPayload.title === 'string'
        ? jobPayload.title
        : '';

    const company =
      typeof jobPayload.company === 'string'
        ? jobPayload.company
        : typeof jobPayload.companyName === 'string'
        ? jobPayload.companyName
        : '';

    const country =
      typeof jobPayload.country === 'string'
        ? jobPayload.country
        : typeof jobPayload.location === 'string'
        ? jobPayload.location
        : '';

    const appliedDate =
      typeof jobPayload.appliedDate === 'string'
        ? jobPayload.appliedDate
        : new Date().toISOString();

    const result = addAppliedJob(userId, {
      jobId,
      jobTitle,
      company,
      country,
      appliedDate,
    });

    if (result.success) {
      return res.json({
        success: true,
        jobs: result.record.jobs,
      });
    }

    return res.status(500).json({
      success: false,
      error: result.error || 'Failed to save applied job',
    });
  } catch (error) {
    console.error('Save applied job error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to save applied job',
    });
  }
});

// Delete CV
app.delete('/api/cv/:cvId', (req, res) => {
  try {
    const { cvId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Check if CV is a created CV (cannot be deleted)
    const cv = findCVById(cvId);
    if (cv && cv.isCreated) {
      return res.status(400).json({
        success: false,
        error: 'Created CVs cannot be deleted. You can only delete uploaded CVs.'
      });
    }

    const result = deleteCV(cvId, userId);

    if (result.success) {
      return res.json({
        success: true,
        message: 'CV deleted successfully'
      });
    } else {
      return res.status(404).json({
        success: false,
        error: result.error || 'CV not found'
      });
    }
  } catch (error) {
    console.error('Delete CV error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.path}`,
    availableRoutes: [
      'GET /',
      'POST /api/signup',
      'POST /api/signup/google',
      'POST /api/login',
      'POST /api/login/google',
      'POST /api/change-password',
      'GET /api/profile/preferences/:userId',
      'POST /api/profile/preferences',
      'GET /api/profile/analytics/:userId',
      'POST /api/profile/analytics',
      'GET /api/profile/activity/:userId',
      'POST /api/profile/activity',
      'GET /api/profile/recent-jobs/:userId',
      'POST /api/profile/recent-jobs',
      'GET /api/profile/skills/:userId',
      'POST /api/profile/skills',
      'POST /api/cv/upload',
      'GET /api/cv/user/:userId',
      'GET /api/cv/:cvId/preview',
      'GET /api/cv/:cvId/download',
      'DELETE /api/cv/:cvId',
      'GET /api/cv-data/:userId',
      'POST /api/cv-data',
      'GET /api/jobs',
      'GET /api/explore-jobs/:userId',
      'GET /api/job-preferences/:userId',
      'POST /api/job-preferences',
      'GET /api/applied-jobs/:userId',
      'POST /api/applied-jobs'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`\n=== VERIFYING ROUTES ===`);
  // Verify explore-jobs route is registered
  const routes = app._router.stack
    .filter(r => r.route)
    .map(r => `${Object.keys(r.route.methods)[0].toUpperCase()} ${r.route.path}`);
  const exploreRoute = routes.find(r => r.includes('explore-jobs'));
  if (exploreRoute) {
    console.log(`✓ Explore Jobs route registered: ${exploreRoute}`);
  } else {
    console.log(`✗ WARNING: Explore Jobs route NOT found in registered routes!`);
  }
  console.log(`=== END ROUTE VERIFICATION ===\n`);
  console.log(`Available endpoints:`);
  console.log(`  GET  http://localhost:${PORT}/`);
  console.log(`  POST http://localhost:${PORT}/api/signup`);
  console.log(`  POST http://localhost:${PORT}/api/signup/google`);
  console.log(`  POST http://localhost:${PORT}/api/login`);
  console.log(`  POST http://localhost:${PORT}/api/login/google`);
  console.log(`  POST http://localhost:${PORT}/api/change-password`);
  console.log(`  GET  http://localhost:${PORT}/api/profile/preferences/:userId`);
  console.log(`  POST http://localhost:${PORT}/api/profile/preferences`);
  console.log(`  GET  http://localhost:${PORT}/api/profile/analytics/:userId`);
  console.log(`  POST http://localhost:${PORT}/api/profile/analytics`);
  console.log(`  GET  http://localhost:${PORT}/api/profile/activity/:userId`);
  console.log(`  POST http://localhost:${PORT}/api/profile/activity`);
  console.log(`  GET  http://localhost:${PORT}/api/profile/recent-jobs/:userId`);
  console.log(`  POST http://localhost:${PORT}/api/profile/recent-jobs`);
  console.log(`  GET  http://localhost:${PORT}/api/profile/skills/:userId`);
  console.log(`  POST http://localhost:${PORT}/api/profile/skills`);
  console.log(`\nJobs:`);
  console.log(`  GET  http://localhost:${PORT}/api/jobs`);
  console.log(`  GET  http://localhost:${PORT}/api/explore-jobs/:userId`);
  console.log(`  GET  http://localhost:${PORT}/api/job-preferences/:userId`);
  console.log(`  POST http://localhost:${PORT}/api/job-preferences`);
  console.log(`  GET  http://localhost:${PORT}/api/applied-jobs/:userId`);
  console.log(`  POST http://localhost:${PORT}/api/applied-jobs`);
  console.log(`\nCV Management:`);
  console.log(`  POST http://localhost:${PORT}/api/cv/upload`);
  console.log(`  GET  http://localhost:${PORT}/api/cv/user/:userId`);
  console.log(`  GET  http://localhost:${PORT}/api/cv/:cvId/preview`);
  console.log(`  GET  http://localhost:${PORT}/api/cv/:cvId/download`);
  console.log(`  DELETE http://localhost:${PORT}/api/cv/:cvId`);
});

