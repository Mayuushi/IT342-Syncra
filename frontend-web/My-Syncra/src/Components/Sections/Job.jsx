import React, { useState, useEffect } from "react";
import { NavBar } from "../NavBar";
import { useNavigate } from "react-router-dom";
import jobService from "../../Service/jobService";
import authService from "../../Service/authService";
import "./Job.css";

const workingScheduleOptions = [
  "Full time",
  "Part time",
  "Internship",
  "Project Work",
  "Volunteering",
];

const employmentTypeOptions = [
  "Full day",
  "Flexible Schedule",
  "Shift Work",
  "Distant Work",
  "Shift Method",
];

function Jobs() {
  const navigate = useNavigate();
  const [selectedWorking, setSelectedWorking] = useState([]);
  const [selectedEmployment, setSelectedEmployment] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);

  // Check if user is logged in
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const fetchedJobs = await jobService.getAllJobs();
        console.log("Fetched jobs:", fetchedJobs);
        setJobs(fetchedJobs || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Fetch saved jobs if user is logged in
  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (currentUser && currentUser.id) {
        try {
          const userSavedJobs = await jobService.getSavedJobs(currentUser.id);
          setSavedJobs(userSavedJobs || []);
        } catch (err) {
          console.error("Error fetching saved jobs:", err);
        }
      }
    };

    fetchSavedJobs();
  }, [currentUser]);

  const handleWorkingChange = (option) => {
    setSelectedWorking((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const handleEmploymentChange = (option) => {
    setSelectedEmployment((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  // Apply filters from backend
  useEffect(() => {
    const applyFilters = async () => {
      if (selectedWorking.length > 0 || selectedEmployment.length > 0) {
        try {
          setLoading(true);
          const filteredJobs = await jobService.getFilteredJobs(
            selectedWorking,
            selectedEmployment
          );
          setJobs(filteredJobs || []);
          setError(null);
        } catch (err) {
          console.error("Error filtering jobs:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        // If no filters selected, fetch all jobs again
        try {
          setLoading(true);
          const allJobs = await jobService.getAllJobs();
          setJobs(allJobs || []);
          setError(null);
        } catch (err) {
          console.error("Error fetching all jobs:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    applyFilters();
  }, [selectedWorking, selectedEmployment]);

  const handleSaveJob = async (jobId) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      await jobService.saveJob(currentUser.id, jobId);
      // Update saved jobs list
      const updatedSavedJobs = await jobService.getSavedJobs(currentUser.id);
      setSavedJobs(updatedSavedJobs || []);
      alert("Job saved successfully!");
    } catch (err) {
      console.error("Error saving job:", err);
      alert("Failed to save job. Please try again.");
    }
  };

  const handleApplyJob = async (jobId) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      await jobService.applyForJob(currentUser.id, jobId);
      alert("You've successfully applied for this job!");
    } catch (err) {
      console.error("Error applying for job:", err);
      alert("Failed to apply for job. Please try again.");
    }
  };

  const isJobSaved = (jobId) => {
    return savedJobs.some(job => job.id === jobId);
  };

  const handleJobDetails = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <>
      <NavBar />
      <div className="job-root">
        <aside className="job-sidebar">
          <div className="job-promo">
            <div className="job-promo-content">
              <h2>Get your<br />Best profession<br />with Syncra</h2>
              <button>VIEW ALL</button>
            </div>
          </div>
          <div className="job-filters">
            <h3>FILTERS</h3>
            <div className="job-filter-group">
              <div className="job-filter-title">Working Schedule</div>
              {workingScheduleOptions.map((option) => (
                <label key={option} className="job-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedWorking.includes(option)}
                    onChange={() => handleWorkingChange(option)}
                  />
                  {option}
                </label>
              ))}
            </div>
            <div className="job-filter-group">
              <div className="job-filter-title">Employment type</div>
              {employmentTypeOptions.map((option) => (
                <label key={option} className="job-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedEmployment.includes(option)}
                    onChange={() => handleEmploymentChange(option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        </aside>
        <main className="job-main">
          <div className="job-header">
            <h1>Recommended Jobs <span className="job-count">{jobs.length}</span></h1>
            <div className="job-sort">
              sort by: <a href="#" className="job-sort-link">Last Update</a>
            </div>
          </div>

          {loading && (
            <div className="job-loading">Loading jobs...</div>
          )}

          {error && (
            <div className="job-error">
              Error: {error}
              <button onClick={() => window.location.reload()}>Try Again</button>
            </div>
          )}

          {!loading && jobs.length === 0 && !error && (
            <div className="job-empty">No jobs match your criteria.</div>
          )}

          <div className="job-grid">
            {!loading &&
              jobs.map((job) => (
                <div className="job-card" key={job.id}>
                  <div className="job-card-date">{job.date || "N/A"}</div>
                  <div className="job-card-company">{job.company || "Unknown Company"}</div>
                  <div className="job-card-title">{job.title || "Unknown Position"}</div>
                  <div className="job-card-tags">
                    {job.tags && job.tags.map((tag, idx) => (
                      <span className="job-tag" key={idx}>{tag}</span>
                    ))}
                    {!job.tags && <span className="job-tag">No tags</span>}
                  </div>
                  <div className="job-card-bottom">
                    <span className="job-card-rate">{job.rate || "N/A"}</span>
                    <div className="job-card-actions">
                      <button 
                        className={`job-card-save ${isJobSaved(job.id) ? 'saved' : ''}`}
                        onClick={() => handleSaveJob(job.id)}
                        title={isJobSaved(job.id) ? "Job Saved" : "Save Job"}
                      >
                        ♥
                      </button>
                      <button 
                        className="job-card-details"
                        onClick={() => handleJobDetails(job.id)}
                      >
                        Details
                      </button>
                      <button 
                        className="job-card-apply"
                        onClick={() => handleApplyJob(job.id)}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </main>
      </div>
    </>
  );
}

export default Jobs;