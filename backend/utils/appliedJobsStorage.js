const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const APPLIED_JOBS_FILE = path.join(DATA_DIR, 'appliedJobs.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize appliedJobs.json if it doesn't exist
if (!fs.existsSync(APPLIED_JOBS_FILE)) {
  fs.writeFileSync(APPLIED_JOBS_FILE, JSON.stringify([], null, 2));
}

function readAppliedJobsFile() {
  try {
    const data = fs.readFileSync(APPLIED_JOBS_FILE, 'utf8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error reading applied jobs file:', error);
    return [];
  }
}

function writeAppliedJobsFile(entries) {
  try {
    fs.writeFileSync(APPLIED_JOBS_FILE, JSON.stringify(entries, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing applied jobs file:', error);
    return false;
  }
}

function findAppliedJobsByUserId(userId) {
  const allEntries = readAppliedJobsFile();
  const record = allEntries.find((entry) => entry.userId === userId);

  if (record) {
    record.jobs = Array.isArray(record.jobs) ? record.jobs : [];
  }

  return record || null;
}

function addAppliedJob(userId, jobData) {
  if (!userId) {
    return { success: false, error: 'User ID is required' };
  }

  const normalize = (value) => (value || '').toString().trim().toLowerCase();

  const allEntries = readAppliedJobsFile();
  const index = allEntries.findIndex((entry) => entry.userId === userId);

  const now = new Date();
  const appliedDate = jobData?.appliedDate;
  const appliedDateObj = appliedDate ? new Date(appliedDate) : now;
  const sanitizedAppliedDate = Number.isNaN(appliedDateObj.getTime())
    ? now.toISOString()
    : appliedDateObj.toISOString();

  const sanitizedJob = {
    jobId: jobData?.jobId ? String(jobData.jobId).trim() : null,
    jobTitle: jobData?.jobTitle ? String(jobData.jobTitle).trim() : 'Job Title',
    company: jobData?.company ? String(jobData.company).trim() : 'Company',
    appliedDate: sanitizedAppliedDate,
    country: jobData?.country ? String(jobData.country).trim() : 'Country',
  };

  if (index === -1) {
    allEntries.push({
      userId,
      jobs: [sanitizedJob],
      updatedAt: new Date().toISOString(),
    });
  } else {
    const existingJobs = Array.isArray(allEntries[index].jobs) ? allEntries[index].jobs : [];
    const filteredJobs = existingJobs.filter((job) => {
      if (sanitizedJob.jobId && job?.jobId) {
        return String(job.jobId) !== sanitizedJob.jobId;
      }
      const existingKey = `${normalize(job?.jobTitle)}|${normalize(job?.company)}`;
      const newKey = `${normalize(sanitizedJob.jobTitle)}|${normalize(sanitizedJob.company)}`;
      return existingKey !== newKey;
    });
    filteredJobs.unshift(sanitizedJob);
    allEntries[index].jobs = filteredJobs;
    allEntries[index].updatedAt = new Date().toISOString();
  }

  const success = writeAppliedJobsFile(allEntries);
  if (!success) {
    return { success: false, error: 'Failed to save applied job' };
  }

  const record = allEntries.find((entry) => entry.userId === userId);
  return {
    success: true,
    record,
  };
}

module.exports = {
  findAppliedJobsByUserId,
  addAppliedJob,
  readAppliedJobsFile,
};

