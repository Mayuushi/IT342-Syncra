import axios from 'axios';

const API_BASE_URL = 'https://it342-syncra.onrender.com/api/jobs';
const USER_API_URL = 'https://it342-syncra.onrender.com/api/users';

// Configure axios defaults
axios.defaults.timeout = 15000; // 15 seconds timeout

// Helper function to handle API errors
const handleApiError = (error, defaultMessage) => {
  console.error(defaultMessage, error);
  
  // Check if it's a network error
  if (error.message === 'Network Error') {
    throw new Error('Network error: Please check your internet connection');
  }
  
  // Check for timeout
  if (error.code === 'ECONNABORTED') {
    throw new Error('Request timed out: The server took too long to respond');
  }
  
  // Handle specific status codes
  if (error.response) {
    console.error('Error response:', error.response);
    
    switch (error.response.status) {
      case 401:
        throw new Error('Authentication error: Please log in again');
      case 403:
        throw new Error('Permission denied: You do not have access to this resource');
      case 404:
        throw new Error('Not found: The requested resource does not exist');
      case 500:
        throw new Error('Server error: Something went wrong on the server');
      default:
        throw new Error(error.response?.data?.message || defaultMessage);
    }
  }
  
  throw new Error(defaultMessage);
};

// Get all jobs with retries
const getAllJobs = async (retries = 2) => {
  let attempt = 0;
  
  while (attempt <= retries) {
    try {
      console.log(`[Attempt ${attempt + 1}] Fetching all jobs from:`, API_BASE_URL);
      const response = await axios.get(API_BASE_URL);
      console.log('Jobs response:', response.data);
      
      // Check if the response contains jobs array
      if (!response.data.jobs) {
        console.warn('No jobs found in response:', response.data);
        return [];
      }
      
      return response.data.jobs;
    } catch (error) {
      attempt++;
      
      if (attempt > retries) {
        return handleApiError(error, 'Failed to fetch jobs');
      }
      
      // Wait before retrying (incremental backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};

// Get job by ID with retries
const getJobById = async (id, retries = 2) => {
  if (!id) {
    throw new Error('Job ID is required');
  }
  
  let attempt = 0;
  
  while (attempt <= retries) {
    try {
      console.log(`[Attempt ${attempt + 1}] Fetching job with ID ${id} from: ${API_BASE_URL}/${id}`);
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      console.log('Job detail response:', response);
      
      // Verify the response contains the job data
      if (!response.data || !response.data.job) {
        console.warn('Job not found in response:', response.data);
        
        // If this is a valid response but no job data, return null instead of retrying
        if (response.status === 200) {
          return null;
        }
        
        throw new Error('Job data not found in response');
      }
      
      return response.data.job;
    } catch (error) {
      attempt++;
      
      if (attempt > retries) {
        return handleApiError(error, `Failed to fetch job with ID: ${id}`);
      }
      
      // Wait before retrying (incremental backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};

// Get filtered jobs
const getFilteredJobs = async (workingSchedule, employmentType, retries = 1) => {
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
  
  let attempt = 0;
  
  while (attempt <= retries) {
    try {
      console.log(`[Attempt ${attempt + 1}] Fetching filtered jobs from:`, url);
      const response = await axios.get(url);
      console.log('Filtered jobs response:', response.data);
      
      // Check if the response contains jobs array
      if (!response.data.jobs) {
        console.warn('No filtered jobs found in response:', response.data);
        return [];
      }
      
      return response.data.jobs;
    } catch (error) {
      attempt++;
      
      if (attempt > retries) {
        return handleApiError(error, 'Failed to filter jobs');
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};

// Save a job for a user
const saveJob = async (userId, jobId) => {
  if (!userId || !jobId) {
    throw new Error('User ID and Job ID are required');
  }
  
  try {
    console.log(`Saving job ${jobId} for user ${userId}`);
    const response = await axios.post(`${USER_API_URL}/${userId}/saved-jobs/${jobId}`);
    console.log('Save job response:', response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, `Failed to save job ${jobId} for user ${userId}`);
  }
};

// Remove a saved job
const removeSavedJob = async (userId, jobId) => {
  if (!userId || !jobId) {
    throw new Error('User ID and Job ID are required');
  }
  
  try {
    console.log(`Removing saved job ${jobId} for user ${userId}`);
    const response = await axios.delete(`${USER_API_URL}/${userId}/saved-jobs/${jobId}`);
    console.log('Remove saved job response:', response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, `Failed to remove saved job ${jobId} for user ${userId}`);
  }
};

// Get saved jobs for a user
const getSavedJobs = async (userId) => {
  if (!userId) {
    console.warn('User ID is required to get saved jobs');
    return [];
  }
  
  try {
    console.log(`Fetching saved jobs for user ${userId}`);
    const response = await axios.get(`${USER_API_URL}/${userId}/saved-jobs`);
    console.log('Saved jobs response:', response.data);
    
    if (!response.data.savedJobs && Array.isArray(response.data)) {
      // Some APIs may return the array directly
      return response.data;
    }
    
    return response.data.savedJobs || [];
  } catch (error) {
    // For saved jobs, fail gracefully by returning empty array
    console.error(`Error fetching saved jobs for user ${userId}:`, error);
    return [];
  }
};

// Apply for a job
const applyForJob = async (userId, jobId) => {
  if (!userId || !jobId) {
    throw new Error('User ID and Job ID are required');
  }
  
  try {
    console.log(`Applying for job ${jobId} for user ${userId}`);
    const response = await axios.post(`${USER_API_URL}/${userId}/applied-jobs/${jobId}`);
    console.log('Apply for job response:', response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, `Failed to apply for job ${jobId} for user ${userId}`);
  }
};

// Get applied jobs for a user
const getAppliedJobs = async (userId) => {
  if (!userId) {
    console.warn('User ID is required to get applied jobs');
    return [];
  }
  
  try {
    console.log(`Fetching applied jobs for user ${userId}`);
    const response = await axios.get(`${USER_API_URL}/${userId}/applied-jobs`);
    console.log('Applied jobs response:', response.data);
    
    if (!response.data.appliedJobs && Array.isArray(response.data)) {
      // Some APIs may return the array directly
      return response.data;
    }
    
    return response.data.appliedJobs || [];
  } catch (error) {
    // For applied jobs, fail gracefully by returning empty array
    console.error(`Error fetching applied jobs for user ${userId}:`, error);
    return [];
  }
};

// Update user job profile
const updateJobProfile = async (userId, profileData) => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  try {
    console.log(`Updating job profile for user ${userId}:`, profileData);
    const response = await axios.put(`${USER_API_URL}/${userId}/job-profile`, profileData);
    console.log('Update job profile response:', response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, `Failed to update job profile for user ${userId}`);
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