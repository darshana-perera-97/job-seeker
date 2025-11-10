const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const CV_DIR = path.join(DATA_DIR, 'cv');
const CVS_FILE = path.join(DATA_DIR, 'cvs.json');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(CV_DIR)) {
  fs.mkdirSync(CV_DIR, { recursive: true });
}

// Initialize cvs.json if it doesn't exist
if (!fs.existsSync(CVS_FILE)) {
  fs.writeFileSync(CVS_FILE, JSON.stringify([], null, 2));
}

// Read all CVs
function getAllCVs() {
  try {
    const data = fs.readFileSync(CVS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading CVs file:', error);
    return [];
  }
}

// Save all CVs
function saveAllCVs(cvs) {
  try {
    fs.writeFileSync(CVS_FILE, JSON.stringify(cvs, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing CVs file:', error);
    return false;
  }
}

// Find CVs by user ID
function findCVsByUserId(userId) {
  const cvs = getAllCVs();
  return cvs.filter(cv => cv.userId === userId);
}

// Find CV by ID
function findCVById(cvId) {
  const cvs = getAllCVs();
  return cvs.find(cv => cv.id === cvId);
}

// Add new CV
function addCV(cvData) {
  const cvs = getAllCVs();
  
  // Generate unique ID
  const newId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
  
  const newCV = {
    id: newId,
    userId: cvData.userId,
    fileName: cvData.fileName,
    originalFileName: cvData.originalFileName,
    fileType: cvData.fileType,
    fileSize: cvData.fileSize,
    filePath: cvData.filePath,
    cvName: cvData.cvName || cvData.originalFileName?.replace(/\.[^/.]+$/, '') || 'Uploaded CV',
    isCreated: cvData.isCreated || false, // Flag to identify created CVs vs uploaded CVs
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  cvs.push(newCV);
  
  if (saveAllCVs(cvs)) {
    return { success: true, cv: newCV };
  } else {
    return { success: false, error: 'Failed to save CV' };
  }
}

// Delete CV
function deleteCV(cvId, userId) {
  const cvs = getAllCVs();
  const cvIndex = cvs.findIndex(cv => cv.id === cvId && cv.userId === userId);
  
  if (cvIndex === -1) {
    return { success: false, error: 'CV not found' };
  }

  const cv = cvs[cvIndex];
  
  // Delete the file
  if (cv.filePath && fs.existsSync(cv.filePath)) {
    try {
      fs.unlinkSync(cv.filePath);
    } catch (error) {
      console.error('Error deleting CV file:', error);
    }
  }

  // Remove from array
  cvs.splice(cvIndex, 1);
  
  if (saveAllCVs(cvs)) {
    return { success: true };
  } else {
    return { success: false, error: 'Failed to delete CV' };
  }
}

// Get CV file path
function getCVFilePath(cvId, userId) {
  const cv = findCVById(cvId);
  if (!cv || cv.userId !== userId) {
    return null;
  }
  return cv.filePath;
}

module.exports = {
  getAllCVs,
  findCVsByUserId,
  findCVById,
  addCV,
  deleteCV,
  getCVFilePath,
  CV_DIR,
  saveAllCVs,
};

