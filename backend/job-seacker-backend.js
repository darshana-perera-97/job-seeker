const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { findUserByEmail, addUser, findUserById, updateUser } = require('./utils/userStorage');
const { findProfileByUserId, upsertProfile } = require('./utils/profileStorage');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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

    const defaultPreferences = {
      emailNotifications: true,
      jobRecommendations: true,
      applicationUpdates: true,
      marketingEmails: false
    };

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
      'POST /api/profile/preferences'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`  GET  http://localhost:${PORT}/`);
  console.log(`  POST http://localhost:${PORT}/api/signup`);
  console.log(`  POST http://localhost:${PORT}/api/signup/google`);
  console.log(`  POST http://localhost:${PORT}/api/login`);
  console.log(`  POST http://localhost:${PORT}/api/login/google`);
  console.log(`  POST http://localhost:${PORT}/api/change-password`);
  console.log(`  GET  http://localhost:${PORT}/api/profile/preferences/:userId`);
  console.log(`  POST http://localhost:${PORT}/api/profile/preferences`);
});

