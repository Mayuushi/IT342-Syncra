import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NavBar } from "../NavBar";
import companyService from "../../Service/companyService";
import authService from "../../Service/authService";
import "./CompanyForm.css";

function CompanyJobs() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch company details
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);
        const response = await companyService.getCompanyById(id);
        setCompany(response.data);
        
        // Check if current user is the owner
        if (currentUser && response.data.owner && response.data.owner.id === currentUser.id) {
          setIsOwner(true);
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching company details:", err);
        setError("Failed to load company details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCompanyDetails();
    }
  }, [id, currentUser]);

  // Fetch company jobs
  useEffect(() => {
    const fetchCompanyJobs = async () => {
      try {
        setLoading(true);
        const response = await companyService.getCompanyJobs(id);
        setJobs(response.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching company jobs:", err);
        setError("Failed to load company jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCompanyJobs();
    }
  }, [id]);

  const handleBackToCompany = () => {
    navigate(`/company/${id}`);
  };

  const handleCreateJob = () => {
    navigate(`/company/${id}/post-job`);
  };

  const handleEditJob = (jobId) => {
    // For future implementation
    alert("Edit functionality will be implemented in future updates.");
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job listing?")) {
      return;
    }

    try {
      await companyService.deleteJob(id, jobId, currentUser.id);
      // Update jobs list after deletion
      setJobs(jobs.filter(job => job.id !== jobId));
      alert("Job deleted successfully!");
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Failed to delete job. Please try again.");
    }
  };

  const handleViewJob = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <>
      <NavBar />
      <div className="company-jobs-container">
        {loading && (
          <div className="company-loading">Loading company jobs...</div>
        )}

        {error && (
          <div className="company-error">
            <p>{error}</p>
            <button onClick={() => navigate("/company")}>Back to Companies</button>
          </div>
        )}

        {!loading && company && (
          <>
            <div className="company-jobs-header">
              <div className="company-jobs-title">
                <button className="back-button" onClick={handleBackToCompany}>
                  ← Back to Company
                </button>
                <h1>Jobs at {company.name}</h1>
              </div>
              
              {isOwner && (
                <button className="create-job-button" onClick={handleCreateJob}>
                  Post New Job
                </button>
              )}
            </div>

            {jobs.length === 0 ? (
              <div className="company-jobs-empty">
                <p>No job listings found for this company.</p>
                {isOwner && (
                  <button onClick={handleCreateJob}>Create Your First Job Listing</button>
                )}
              </div>
            ) : (
              <div className="company-jobs-list">
                <table className="company-jobs-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Location</th>
                      <th>Type</th>
                      <th>Posted Date</th>
                      <th>Applications</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map(job => (
                      <tr key={job.id} className="company-jobs-row">
                        <td className="job-title">{job.title}</td>
                        <td>{job.location || "Remote"}</td>
                        <td>{job.type || "Full time"}</td>
                        <td>{new Date(job.createdAt || Date.now()).toLocaleDateString()}</td>
                        <td>{job.applications?.length || 0}</td>
                        <td className="company-jobs-actions">
                          <button 
                            className="view-job-btn" 
                            onClick={() => handleViewJob(job.id)}
                          >
                            View
                          </button>
                          
                          {isOwner && (
                            <>
                              <button 
                                className="edit-job-btn" 
                                onClick={() => handleEditJob(job.id)}
                              >
                                Edit
                              </button>
                              <button 
                                className="delete-job-btn" 
                                onClick={() => handleDeleteJob(job.id)}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default CompanyJobs;