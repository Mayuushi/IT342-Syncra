import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NavBar } from "../NavBar";
import jobService from "../../Service/jobService";
import authService from "../../Service/authService";
import "./Job.css";

function JobDetails() {
  const { jobId } = useParams();
  console.log("Extracted job ID:", jobId);
  
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const user = authService.getCurrentUser();
    console.log("Current user:", user);
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      console.log("Attempting to fetch job details with ID:", jobId);
      
      // Make sure id is actually defined and not empty
      if (!jobId || jobId === "undefined" || jobId === "null") {
        console.error("Invalid job ID:", jobId);
        setError("No valid job ID provided in the URL");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log("Calling jobService.getJobById with ID:", jobId);
        const jobData = await jobService.getJobById(jobId);
        
        console.log("Job data received:", jobData);
        
        if (!jobData) {
          throw new Error("Job not found");
        }
        
        setJob(jobData);
        setError(null);
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError(err.message || "Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  // Check if job is saved/applied
  useEffect(() => {
    const checkJobStatus = async () => {
      if (!currentUser || !currentUser.jobId) {
        console.log("No current user, skipping job status check");
        return;
      }
      
      if (!job || !job.jobId) {
        console.log("No job data, skipping job status check");
        return;
      }
      
      console.log("Checking job status for user:", currentUser.jobId, "and job:", job.jobId);
      
      try {
        // Check saved jobs
        const savedJobs = await jobService.getSavedJobs(currentUser.jobId);
        console.log("Saved jobs:", savedJobs);
        setIsSaved(savedJobs.some(savedJob => savedJob.jobId === job.jobId));

        // Check applied jobs
        const appliedJobs = await jobService.getAppliedJobs(currentUser.jobId);
        console.log("Applied jobs:", appliedJobs);
        setIsApplied(appliedJobs.some(appliedJob => appliedJob.jobId === job.jobId));
      } catch (err) {
        console.error("Error checking job status:", err);
      }
    };

    checkJobStatus();
  }, [currentUser, job]);

  const handleSaveJob = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      if (isSaved) {
        await jobService.removeSavedJob(currentUser.jobId, job.jobId);
        setIsSaved(false);
        alert("Job removed from saved jobs");
      } else {
        await jobService.saveJob(currentUser.jobId, job.jobId);
        setIsSaved(true);
        alert("Job saved successfully!");
      }
    } catch (err) {
      console.error("Error saving/removing job:", err);
      alert("Operation failed. Please try again.");
    }
  };

  const handleApplyJob = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (isApplied) {
      alert("You've already applied for this job!");
      return;
    }

    try {
      await jobService.applyForJob(currentUser.jobId, job.jobId);
      setIsApplied(true);
      alert("You've successfully applied for this job!");
    } catch (err) {
      console.error("Error applying for job:", err);
      alert("Failed to apply for job. Please try again.");
    }
  };

  // Format date if available
  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get first letter of company name for logo placeholder
  const getCompanyInitial = (companyName) => {
    return companyName ? companyName.charAt(0).toUpperCase() : "J";
  };

  return (
    <>
      <NavBar />
      <div className="job-details-container">
        {loading && <div className="job-loading">Loading job details...</div>}

        {error && (
          <div className="job-error">
            <h3>Error</h3>
            <p>{error}</p>
            <p>Debug Info: ID parameter = {jobId || "not provided"}</p>
            <button onClick={() => navigate("/jobs")}>Back to Jobs</button>
          </div>
        )}

        {!loading && job && (
          <div className="job-details-content">
            <div className="job-details-header">
              <button 
                className="job-details-back" 
                onClick={() => navigate("/jobs")}
              >
                ← Back to Jobs
              </button>
              <div className="job-details-actions">
                <button 
                  className={`job-details-save ${isSaved ? 'saved' : ''}`}
                  onClick={handleSaveJob}
                >
                  {isSaved ? "Saved" : "Save Job"}
                </button>
                <button 
                  className={`job-details-apply ${isApplied ? 'applied' : ''}`}
                  onClick={handleApplyJob}
                  disabled={isApplied}
                >
                  {isApplied ? "Applied" : "Apply Now"}
                </button>
              </div>
            </div>

            <div className="job-details-main">
              <div className="job-details-company-section">
                <div className="job-details-company-logo">
                  {getCompanyInitial(job.company)}
                </div>
                <div className="job-details-company">
                  <h1 className="job-details-title">{job.title}</h1>
                  <h2 className="job-details-company-name">{job.company}</h2>
                  <div className="job-details-meta">
                    <span className="job-details-location">{job.location || "Remote"}</span>
                    <span className="job-details-date">Posted: {formatDate(job.date)}</span>
                  </div>
                </div>
              </div>

              <div className="job-details-info-section">
                <div className="job-details-tags">
                  {job.tags && job.tags.map((tag, idx) => (
                    <span className="job-tag" key={idx}>{tag}</span>
                  ))}
                  {(!job.tags || job.tags.length === 0) && (
                    <>
                      <span className="job-tag">Full-time</span>
                      <span className="job-tag">{job.category || "General"}</span>
                    </>
                  )}
                </div>
                <div className="job-details-rate">
                  <strong>Rate:</strong> {job.rate || "Negotiable"}
                </div>
              </div>

              <div className="job-details-description">
                <h3>Job Description</h3>
                <div className="job-details-description-content">
                  {job.description ? (
                    <div dangerouslySetInnerHTML={{ __html: job.description }} />
                  ) : (
                    <p>No detailed description available for this position.</p>
                  )}
                </div>
              </div>

              {job.requirements && (
                <div className="job-details-description">
                  <h3>Requirements</h3>
                  <div className="job-details-description-content">
                    <div dangerouslySetInnerHTML={{ __html: job.requirements }} />
                  </div>
                </div>
              )}

              {job.applicationUrl && (
                <div className="job-external-apply">
                  <h3>External Application</h3>
                  <p>
                    This job also accepts applications through their website:
                  </p>
                  <a 
                    href={job.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="job-external-link"
                  >
                    Apply on Company Website
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default JobDetails;