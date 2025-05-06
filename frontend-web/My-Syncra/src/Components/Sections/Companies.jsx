import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../NavBar";
import companyService from "../../Service/companyService";
import authService from "../../Service/authService";
import "./Company.css";

function Companies() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    } else {
      // Redirect to login if not logged in
      navigate("/login");
    }
  }, [navigate]);

  // Fetch user's companies
  useEffect(() => {
    const fetchCompanies = async () => {
      if (!currentUser) return;
    
      try {
        setLoading(true);
        const response = await companyService.getUserCompanies(currentUser.id);
        const companiesData = Array.isArray(response.data) ? response.data : [];
        setCompanies(companiesData);
        setError(null);
      } catch (err) {
        console.error("Error fetching companies:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [currentUser]);

  const handleCreateCompany = () => {
    navigate("/companyform");
  };

  const handleViewCompany = (companyId) => {
    navigate(`/companies/${companyId}`);
  };

  const handleEditCompany = (companyId) => {
    navigate(`/companies/${companyId}/edit`);
  };

  const handleDeleteCompany = async (companyId) => {
    if (!window.confirm("Are you sure you want to delete this company?")) {
      return;
    }

    try {
      await companyService.deleteCompany(companyId, currentUser.id);
      setCompanies(companies.filter(company => company.id !== companyId));
      alert("Company deleted successfully!");
    } catch (err) {
      console.error("Error deleting company:", err);
      alert("Failed to delete company. Please try again.");
    }
  };

  const handlePostJob = (companyId) => {
    navigate(`/companies/${companyId}/post-job`);
  };

  const handleViewJobs = (companyId) => {
    navigate(`/companies/${companyId}/jobs`);
  };

  return (
    <>
      <NavBar />
      <div className="company-container">
        <div className="company-header">
          <h1>My Companies</h1>
          <button 
            className="company-create-btn"
            onClick={handleCreateCompany}
          >
            Create New Company
          </button>
        </div>

        {loading && (
          <div className="company-loading">Loading companies...</div>
        )}

        {error && (
          <div className="company-error">
            Error: {error}
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        )}

        {!loading && companies.length === 0 && !error && (
          <div className="company-empty">
            <p>You haven't created any companies yet.</p>
            <button onClick={handleCreateCompany}>Create Your First Company</button>
          </div>
        )}

        <div className="company-grid">
          {!loading &&
            companies.map((company) => (
              <div className="company-card" key={company.id}>
                <div className="company-card-logo">
                  {company.logoUrl ? (
                    <img src={company.logoUrl} alt={`${company.name} logo`} />
                  ) : (
                    <div className="company-card-logo-placeholder">
                      {company.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="company-card-verified">
                  {company.verified && <span className="verified-badge">✓ Verified</span>}
                </div>
                <div className="company-card-name">{company.name}</div>
                <div className="company-card-industry">{company.industry || "No industry specified"}</div>
                <div className="company-card-location">{company.location || "No location specified"}</div>
                <div className="company-card-size">{company.size || "No size specified"}</div>
                <div className="company-card-actions">
                  <button 
                    className="company-card-view"
                    onClick={() => handleViewCompany(company.id)}
                  >
                    View
                  </button>
                  <button 
                    className="company-card-edit"
                    onClick={() => handleEditCompany(company.id)}
                  >
                    Edit
                  </button>
                  <button 
                    className="company-card-delete"
                    onClick={() => handleDeleteCompany(company.id)}
                  >
                    Delete
                  </button>
                </div>
                <div className="company-card-job-actions">
                  <button 
                    className="company-card-post-job"
                    onClick={() => handlePostJob(company.id)}
                  >
                    Post Job
                  </button>
                  <button 
                    className="company-card-view-jobs"
                    onClick={() => handleViewJobs(company.id)}
                  >
                    View Posted Jobs
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default Companies;