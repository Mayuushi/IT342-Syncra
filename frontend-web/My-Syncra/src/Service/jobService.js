import axios from 'axios';

const API_BASE_URL = 'https://it342-syncra.onrender.com/api/jobs';
const USER_API_URL = 'https://it342-syncra.onrender.com/api/users';

// Get all jobs
const getAllJobs = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data.jobs;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch jobs';
    throw new Error(message);
  }
};

// Get job by ID
const getJobById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data.job;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch job';
    throw new Error(message);
  }
};

// Get filtered jobs
const getFilteredJobs = async (workingSchedule, employmentType) => {
  try {
    let url = `${API_BASE_URL}/filter`;
    const params = new URLSearchParams();
    
    if (workingSchedule && workingSchedule.length > 0) {
      workingSchedule.forEach(schedule => params.append('workingSchedule', schedule));
    }
    
    if (employmentType && employmentType.length > 0) {
      employmentType.forEach(type => params.append('employmentType', type));
    }
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    
    const response = await axios.get(url);
    return response.data.jobs;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to filter jobs';
    throw new Error(message);
  }
};

// Save a job for a user
const saveJob = async (userId, jobId) => {
  try {
    const response = await axios.post(`${USER_API_URL}/${userId}/saved-jobs/${jobId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to save job';
    throw new Error(message);
  }
};

// Remove a saved job
const removeSavedJob = async (userId, jobId) => {
  try {
    const response = await axios.delete(`${USER_API_URL}/${userId}/saved-jobs/${jobId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to remove saved job';
    throw new Error(message);
  }
};

// Get saved jobs for a user
const getSavedJobs = async (userId) => {
  try {
    const response = await axios.get(`${USER_API_URL}/${userId}/saved-jobs`);
    return response.data.savedJobs;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch saved jobs';
    throw new Error(message);
  }
};

// Apply for a job
const applyForJob = async (userId, jobId) => {
  try {
    const response = await axios.post(`${USER_API_URL}/${userId}/applied-jobs/${jobId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to apply for job';
    throw new Error(message);
  }
};

// Get applied jobs for a user
const getAppliedJobs = async (userId) => {
  try {
    const response = await axios.get(`${USER_API_URL}/${userId}/applied-jobs`);
    return response.data.appliedJobs;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch applied jobs';
    throw new Error(message);
  }
};

// Update user job profile
const updateJobProfile = async (userId, profileData) => {
  try {
    const response = await axios.put(`${USER_API_URL}/${userId}/job-profile`, profileData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update job profile';
    throw new Error(message);
  }
};

const jobService = {
  getAllJobs,
  getJobById,
  getFilteredJobs,
  saveJob,
  removeSavedJob,
  getSavedJobs,
  applyForJob,
  getAppliedJobs,
  updateJobProfile
};

export default jobService;