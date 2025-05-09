import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NavBar } from "../NavBar";
import jobService from "../../Service/jobService";
import authService from "../../Service/authService";
import "./Job.css";

function JobDetails() {
  const { id } = useParams();
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
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const jobData = await jobService.getJobById(id);
        setJob(jobData);
        setError(null);
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id]);

useEffect(() => {
  const checkJobStatus = async () => {
    if (currentUser && currentUser.id && job) {
      try {
        const savedJobs = await jobService.getSavedJobs(currentUser.id);
        setIsSaved(savedJobs.some(savedJob => savedJob.id === job.id));

        const appliedJobs = await jobService.getAppliedJobs(currentUser.id);
        setIsApplied(appliedJobs.some(appliedJob => appliedJob.id === job.id));
      } catch (err) {
        console.error("Error checking job status:", err);
      }
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
        await jobService.removeSavedJob(currentUser.id, job.id);
        setIsSaved(false);
        alert("Job removed from saved jobs");
      } else {
        await jobService.saveJob(currentUser.id, job.id);
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
      await jobService.applyForJob(currentUser.id, job.id);
      setIsApplied(true);
      alert("You've successfully applied for this job!");
    } catch (err) {
      console.error("Error applying for job:", err);
      alert("Failed to apply for job. Please try again.");
    }
  };

  return (
    <>
      <NavBar />
      <div className="job-details-container">
        {loading && <div className="job-loading">Loading job details...</div>}

        {error && (
          <div className="job-error">
            Error: {error}
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
                {/* Company Logo would go here */}
                <div className="job-details-company">
                  <h1 className="job-details-title">{job.title}</h1>
                  <h2 className="job-details-company-name">{job.company}</h2>
                  <div className="job-details-meta">
                    <span className="job-details-location">{job.location || "Remote"}</span>
                    <span className="job-details-date">Posted: {job.date || "Recently"}</span>
                  </div>
                </div>
              </div>

              <div className="job-details-info-section">
                <div className="job-details-tags">
                  {job.tags && job.tags.map((tag, idx) => (
                    <span className="job-tag" key={idx}>{tag}</span>
                  ))}
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

              {job.applicationUrl && (
                <div className="job-external-apply">
                  <h3>External Application</h3>
                  <p>
                    This job also accepts applications through their website:
                    <a 
                      href={job.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="job-external-link"
                    >
                      Apply on Company Website
                    </a>
                  </p>
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