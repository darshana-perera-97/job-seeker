const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const CV_DATA_FILE = path.join(DATA_DIR, 'cvData.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize cvData.json if it doesn't exist
if (!fs.existsSync(CV_DATA_FILE)) {
  fs.writeFileSync(CV_DATA_FILE, JSON.stringify([], null, 2));
}

// Read all CV data
function getAllCVData() {
  try {
    const data = fs.readFileSync(CV_DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading CV data file:', error);
    return [];
  }
}

// Save all CV data
function saveAllCVData(cvDataArray) {
  try {
    fs.writeFileSync(CV_DATA_FILE, JSON.stringify(cvDataArray, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing CV data file:', error);
    return false;
  }
}

// Find CV data by user ID
function findCVDataByUserId(userId) {
  const allData = getAllCVData();
  return allData.find(data => data.userId === userId);
}

// Upsert CV data (create or update)
function upsertCVData(userId, data) {
  const allData = getAllCVData();
  const existingIndex = allData.findIndex(cvData => cvData.userId === userId);
  
  let cvData;
  if (existingIndex === -1) {
    // Create new entry
    cvData = {
      userId: userId,
      personalDetails: data.personalDetails ? {
        fullName: data.personalDetails.fullName || '',
        title: data.personalDetails.title || '',
        email: data.personalDetails.email || '',
        phone: data.personalDetails.phone || '',
        address: data.personalDetails.address || '',
        city: data.personalDetails.city || '',
        country: data.personalDetails.country || '',
        postalCode: data.personalDetails.postalCode || '',
        linkedIn: data.personalDetails.linkedIn || '',
        website: data.personalDetails.website || '',
        summary: data.personalDetails.summary || '',
      } : {},
      cvContent: data.cvContent || {},
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    allData.push(cvData);
  } else {
    // Update existing entry - merge with existing data
    cvData = {
      ...allData[existingIndex],
      userId: userId,
      personalDetails: data.personalDetails !== undefined ? {
        fullName: data.personalDetails.fullName || '',
        title: data.personalDetails.title || '',
        email: data.personalDetails.email || '',
        phone: data.personalDetails.phone || '',
        address: data.personalDetails.address || '',
        city: data.personalDetails.city || '',
        country: data.personalDetails.country || '',
        postalCode: data.personalDetails.postalCode || '',
        linkedIn: data.personalDetails.linkedIn || '',
        website: data.personalDetails.website || '',
        summary: data.personalDetails.summary || '',
      } : allData[existingIndex].personalDetails,
      cvContent: data.cvContent !== undefined ? {
        professionalSummary: data.cvContent.professionalSummary || '',
        experience: Array.isArray(data.cvContent.experience) ? data.cvContent.experience : [],
        education: Array.isArray(data.cvContent.education) ? data.cvContent.education : [],
        skills: Array.isArray(data.cvContent.skills) ? data.cvContent.skills : [],
      } : allData[existingIndex].cvContent,
      updatedAt: new Date().toISOString(),
      createdAt: allData[existingIndex].createdAt,
    };
    allData[existingIndex] = cvData;
  }

  if (saveAllCVData(allData)) {
    return { success: true, cvData };
  } else {
    return { success: false, error: 'Failed to save CV data' };
  }
}

// Delete CV data by user ID
function deleteCVData(userId) {
  const allData = getAllCVData();
  const filtered = allData.filter(data => data.userId !== userId);
  
  if (saveAllCVData(filtered)) {
    return { success: true };
  } else {
    return { success: false, error: 'Failed to delete CV data' };
  }
}

module.exports = {
  getAllCVData,
  findCVDataByUserId,
  upsertCVData,
  deleteCVData,
  CV_DATA_FILE,
};

