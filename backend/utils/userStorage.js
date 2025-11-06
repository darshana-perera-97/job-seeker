const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize users.json if it doesn't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}

// Read all users
function getAllUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
}

// Write all users
function saveAllUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing users file:', error);
    return false;
  }
}

// Find user by email
function findUserByEmail(email) {
  const users = getAllUsers();
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

// Find user by ID
function findUserById(id) {
  const users = getAllUsers();
  return users.find(user => user.id === id);
}

// Add new user
function addUser(userData) {
  const users = getAllUsers();
  
  // Check if user already exists
  if (findUserByEmail(userData.email)) {
    return { success: false, error: 'User with this email already exists' };
  }

  // Generate unique ID
  const newId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
  
  const newUser = {
    id: newId,
    ...userData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  users.push(newUser);
  
  if (saveAllUsers(users)) {
    return { success: true, user: newUser };
  } else {
    return { success: false, error: 'Failed to save user' };
  }
}

// Update user
function updateUser(userId, updates) {
  const users = getAllUsers();
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    return { success: false, error: 'User not found' };
  }

  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  if (saveAllUsers(users)) {
    return { success: true, user: users[userIndex] };
  } else {
    return { success: false, error: 'Failed to update user' };
  }
}

module.exports = {
  getAllUsers,
  saveAllUsers,
  findUserByEmail,
  findUserById,
  addUser,
  updateUser
};

