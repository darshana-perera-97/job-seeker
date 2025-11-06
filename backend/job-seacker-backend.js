const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { findUserByEmail, addUser } = require('./utils/userStorage');

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
      'POST /api/login/google'
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
});

