import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NavBar } from "../NavBar";
import companyService from "../../Service/companyService";
import authService from "../../Service/authService";
import "./Company.css";

function CompanyDetails() {
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
    }
  }, []);

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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [id, currentUser]);

  // Fetch company jobs
  useEffect(() => {
    const fetchCompanyJobs = async () => {
      try {
        const response = await companyService.getCompanyJobs(id);
        setJobs(response.data);
      } catch (err) {
        console.error("Error fetching company jobs:", err);
      }
    };

    if (company) {
      fetchCompanyJobs();
    }
  }, [company, id]);

  const handleEditCompany = () => {
    navigate(`/companies/edit/${id}`);
  };

  const handleDeleteCompany = async () => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await companyService.deleteCompany(id);
        navigate("/company");
      } catch (err) {
        console.error("Error deleting company:", err);
        setError("Failed to delete company. Please try again.");
      }
    }
  };

  const handleJobClick = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleAddJob = () => {
    navigate(`/jobs/create?companyId=${id}`);
  };

  if (loading) {
    return (
      <div className="company-details-container">
        <NavBar />
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="company-details-container">
        <NavBar />
        <div className="error-message">
          <h2>Error loading company details</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/company")}>Back to Companies</button>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="company-details-container">
        <NavBar />
        <div className="not-found-message">
          <h2>Company not found</h2>
          <button onClick={() => navigate("/company")}>Back to Companies</button>
        </div>
      </div>
    );
  }

  return (
    <div className="company-details-container">
      <NavBar />
      <div className="company-header">
        <div className="company-info">
          <h1>{company.name}</h1>
          <p className="company-industry">{company.industry}</p>
          <p className="company-location">{company.location}</p>
          <p className="company-size">Company Size: {company.size || "Not specified"}</p>
          <div className="company-contact">
            <p><strong>Website:</strong> <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a></p>
            <p><strong>Email:</strong> {company.email}</p>
            <p><strong>Phone:</strong> {company.phone}</p>
          </div>
        </div>
        
        {company.logo && (
          <div className="company-logo">
            <img src={company.logo} alt={`${company.name} logo`} />
          </div>
        )}
      </div>

      <div className="company-description">
        <h2>About {company.name}</h2>
        <p>{company.description}</p>
      </div>

      {isOwner && (
        <div className="owner-actions">
          <button className="edit-btn" onClick={handleEditCompany}>Edit Company</button>
          <button className="delete-btn" onClick={handleDeleteCompany}>Delete Company</button>
          <button className="add-job-btn" onClick={handleAddJob}>Post New Job</button>
        </div>
      )}

      <div className="company-jobs">
        <h2>Open Positions</h2>
        {jobs.length === 0 ? (
          <p className="no-jobs-message">No open positions at the moment.</p>
        ) : (
          <div className="jobs-list">
            {jobs.map((job) => (
              <div key={job.id} className="job-card" onClick={() => handleJobClick(job.id)}>
                <h3>{job.title}</h3>
                <p className="job-location">{job.location}</p>
                <p className="job-type">{job.type}</p>
                <p className="job-salary">{job.salary ? `$${job.salary}` : "Salary not specified"}</p>
                <p className="job-posted">Posted: {new Date(job.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CompanyDetails;