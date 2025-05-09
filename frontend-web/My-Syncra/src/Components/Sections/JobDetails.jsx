import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jobService from '../Service/jobService';
import authService from '../Service/authService';
import { FiClock, FiBriefcase, FiMapPin, FiDollarSign, FiBookmark, FiCheck } from 'react-icons/fi';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isJobSaved, setIsJobSaved] = useState(false);
  const [isJobApplied, setIsJobApplied] = useState(false);
  const [processingAction, setProcessingAction] = useState(false);
  
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const jobData = await jobService.getJobById(id);
        setJob(jobData);
        
        // Check if job is saved or applied
        if (currentUser) {
          const savedJobs = await jobService.getSavedJobs(currentUser._id);
          const appliedJobs = await jobService.getAppliedJobs(currentUser._id);
          
          setIsJobSaved(savedJobs.some(savedJob => savedJob._id === id));
          setIsJobApplied(appliedJobs.some(appliedJob => appliedJob._id === id));
        }
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError(err.message || 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id, currentUser]);

  const handleSaveJob = async () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }

    try {
      setProcessingAction(true);
      if (isJobSaved) {
        await jobService.removeSavedJob(currentUser._id, id);
        setIsJobSaved(false);
      } else {
        await jobService.saveJob(currentUser._id, id);
        setIsJobSaved(true);
      }
    } catch (err) {
      console.error('Error saving/unsaving job:', err);
      alert(err.message || 'Failed to save/unsave job');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleApplyJob = async () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }

    try {
      setProcessingAction(true);
      await jobService.applyForJob(currentUser._id, id);
      setIsJobApplied(true);
    } catch (err) {
      console.error('Error applying for job:', err);
      alert(err.message || 'Failed to apply for job');
    } finally {
      setProcessingAction(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => navigate('/jobs')}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="bg-yellow-50 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-yellow-700 mb-2">Job Not Found</h2>
        <p className="text-yellow-600">The job you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/jobs')}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6">
          {/* Company Logo and Name */}
          <div className="flex items-center mb-6">
            <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden mr-4 flex items-center justify-center">
              {job.companyLogo ? (
                <img src={job.companyLogo} alt={`${job.company} logo`} className="w-full h-full object-contain p-2" />
              ) : (
                <span className="text-2xl font-bold text-gray-400">{job.company?.charAt(0) || 'C'}</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{job.title}</h1>
              <p className="text-gray-600">{job.company}</p>
            </div>
          </div>

          {/* Job Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              <FiMapPin className="mr-2 text-blue-500" />
              <span>{job.location || 'Remote'}</span>
            </div>
            <div className="flex items-center">
              <FiClock className="mr-2 text-blue-500" />
              <span>{job.workingSchedule || 'Full-time'}</span>
            </div>
            <div className="flex items-center">
              <FiBriefcase className="mr-2 text-blue-500" />
              <span>{job.employmentType || 'Permanent'}</span>
            </div>
            <div className="flex items-center">
              <FiDollarSign className="mr-2 text-blue-500" />
              <span>{job.salary || 'Competitive salary'}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleApplyJob}
              disabled={isJobApplied || processingAction}
              className={`flex-1 py-3 px-4 rounded-md font-medium text-center transition-colors flex items-center justify-center ${
                isJobApplied
                  ? 'bg-green-100 text-green-800 cursor-default'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isJobApplied ? (
                <>
                  <FiCheck className="mr-2" />
                  Applied
                </>
              ) : (
                'Apply Now'
              )}
            </button>
            <button
              onClick={handleSaveJob}
              disabled={processingAction}
              className={`flex-1 py-3 px-4 rounded-md font-medium text-center transition-colors flex items-center justify-center ${
                isJobSaved
                  ? 'bg-gray-100 text-gray-800 border border-gray-300'
                  : 'bg-white hover:bg-gray-50 text-blue-500 border border-blue-500'
              }`}
            >
              <FiBookmark className="mr-2" />
              {isJobSaved ? 'Saved' : 'Save Job'}
            </button>
          </div>
        </div>
      </div>

      {/* Job Description Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Job Description</h2>
          <div className="prose max-w-none">
            {job.description ? (
              <div dangerouslySetInnerHTML={{ __html: job.description }} />
            ) : (
              <p className="text-gray-600">No detailed description available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Requirements Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Requirements</h2>
          <div className="prose max-w-none">
            {job.requirements ? (
              <div dangerouslySetInnerHTML={{ __html: job.requirements }} />
            ) : (
              <p className="text-gray-600">No requirements specified.</p>
            )}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Benefits</h2>
          {job.benefits && job.benefits.length > 0 ? (
            <ul className="list-disc list-inside space-y-2">
              {job.benefits.map((benefit, index) => (
                <li key={index} className="text-gray-700">{benefit}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No benefits specified.</p>
          )}
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="flex justify-center my-8">
        <button
          onClick={handleApplyJob}
          disabled={isJobApplied || processingAction}
          className={`py-3 px-8 rounded-md font-medium text-center transition-colors ${
            isJobApplied
              ? 'bg-green-100 text-green-800 cursor-default'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isJobApplied ? 'Already Applied' : 'Apply for this Position'}
        </button>
      </div>
    </div>
  );
};

export default JobDetails;