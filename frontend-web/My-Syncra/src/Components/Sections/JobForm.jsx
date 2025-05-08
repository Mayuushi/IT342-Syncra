import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { NavBar } from "../NavBar";
import jobService from "../../Service/jobService";
import companyService from "../../Service/companyService";
import authService from "../../Service/authService";
import "./Job.css";

function JobForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userCompanies, setUserCompanies] = useState([]);
  
  // Get company ID from URL params or query string
  const queryParams = new URLSearchParams(location.search);
  const companyIdFromQuery = queryParams.get("companyId");
  const companyIdFromParams = params.id;
  const companyId = companyIdFromParams || companyIdFromQuery;
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    companyId: companyId || "",
    location: "",
    type: "Full time",
    schedule: "Full day",
    description: "",
    salary: "",
    tags: [],
    applicationUrl: "",
  });

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
    const fetchUserCompanies = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const response = await companyService.getUserCompanies(currentUser.id);
        // Ensure response is an array
        const companiesArray = Array.isArray(response) ? response : [];
        setUserCompanies(companiesArray);
        
        // If we have a companyId and companies loaded, set the company name
        if (companyId && companiesArray.length > 0) {
          const selectedCompany = companiesArray.find(company => company.id === companyId);
          if (selectedCompany) {
            setFormData(prev => ({
              ...prev,
              company: selectedCompany.name,
              companyId: selectedCompany.id
            }));
          }
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching user companies:", err);
        setError("Failed to load your companies. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserCompanies();
  }, [currentUser, companyId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCompanyChange = (e) => {
    const selectedCompanyId = e.target.value;
    const selectedCompany = userCompanies.find(company => company.id === selectedCompanyId);
    
    setFormData({
      ...formData,
      companyId: selectedCompanyId,
      company: selectedCompany ? selectedCompany.name : ""
    });
  };

  const handleTagsChange = (e) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(",").map(tag => tag.trim()).filter(tag => tag !== "");
    
    setFormData({
      ...formData,
      tags: tagsArray
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.companyId) {
      setError("Please fill in all required fields.");
      return;
    }
    
    try {
      setLoading(true);
      
      // Format the job data
      const jobData = {
        ...formData,
        date: new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
      };
      
      // Post the job through the company
      await companyService.postJob(formData.companyId, jobData, currentUser.id);
      
      alert("Job posted successfully!");
      navigate(`/company/${formData.companyId}`);
    } catch (err) {
      console.error("Error creating job:", err);
      setError("Failed to create job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="job-form-container">
        <h1 className="job-form-title">
          {companyId ? "Post a New Job" : "Create a Job Listing"}
        </h1>
        
        {loading && <div className="job-loading">Loading...</div>}
        
        {error && (
          <div className="job-error">
            {error}
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}
        
        <form className="job-form" onSubmit={handleSubmit}>
          <div className="job-form-group">
            <label htmlFor="title" className="job-form-label">Job Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              className="job-form-input"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. Senior React Developer"
              required
            />
          </div>
          
          <div className="job-form-group">
            <label htmlFor="companyId" className="job-form-label">Company *</label>
            <select
              id="companyId"
              name="companyId"
              className="job-form-select"
              value={formData.companyId}
              onChange={handleCompanyChange}
              required
              disabled={companyId ? true : false}
            >
              <option value="">Select a company</option>
              {Array.isArray(userCompanies) && userCompanies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
            {(!userCompanies || userCompanies.length === 0) && !loading && (
              <p className="job-form-hint">
                You need to <a href="/companyform">create a company</a> before posting a job.
              </p>
            )}
          </div>
          
          <div className="job-form-group">
            <label htmlFor="location" className="job-form-label">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              className="job-form-input"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g. San Francisco, CA or Remote"
            />
          </div>
          
          <div className="job-form-row">
            <div className="job-form-group">
              <label htmlFor="type" className="job-form-label">Employment Type</label>
              <select
                id="type"
                name="type"
                className="job-form-select"
                value={formData.type}
                onChange={handleInputChange}
              >
                <option value="Full time">Full time</option>
                <option value="Part time">Part time</option>
                <option value="Internship">Internship</option>
                <option value="Project Work">Project Work</option>
                <option value="Volunteering">Volunteering</option>
              </select>
            </div>
            
            <div className="job-form-group">
              <label htmlFor="schedule" className="job-form-label">Working Schedule</label>
              <select
                id="schedule"
                name="schedule"
                className="job-form-select"
                value={formData.schedule}
                onChange={handleInputChange}
              >
                <option value="Full day">Full day</option>
                <option value="Flexible Schedule">Flexible Schedule</option>
                <option value="Shift Work">Shift Work</option>
                <option value="Distant Work">Distant Work</option>
                <option value="Shift Method">Shift Method</option>
              </select>
            </div>
          </div>
          
          <div className="job-form-group">
            <label htmlFor="salary" className="job-form-label">Salary/Rate</label>
            <input
              type="text"
              id="salary"
              name="salary"
              className="job-form-input"
              value={formData.salary}
              onChange={handleInputChange}
              placeholder="e.g. $100,000 - $120,000/year or $50-70/hour"
            />
          </div>
          
          <div className="job-form-group">
            <label htmlFor="tags" className="job-form-label">Tags (comma separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              className="job-form-input"
              value={Array.isArray(formData.tags) ? formData.tags.join(", ") : ""}
              onChange={handleTagsChange}
              placeholder="e.g. React, JavaScript, Remote"
            />
          </div>
          
          <div className="job-form-group">
            <label htmlFor="description" className="job-form-label">Job Description</label>
            <textarea
              id="description"
              name="description"
              className="job-form-textarea"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter a detailed job description..."
              rows={10}
            ></textarea>
          </div>
          
          <div className="job-form-group">
            <label htmlFor="applicationUrl" className="job-form-label">External Application URL (optional)</label>
            <input
              type="url"
              id="applicationUrl"
              name="applicationUrl"
              className="job-form-input"
              value={formData.applicationUrl}
              onChange={handleInputChange}
              placeholder="e.g. https://yourcompany.com/careers/apply"
            />
          </div>
          
          <div className="job-form-actions">
            <button 
              type="button" 
              className="job-form-cancel-btn"
              onClick={() => navigate(companyId ? `/company/${companyId}` : "/jobs")}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="job-form-submit-btn"
              disabled={loading}
            >
              {loading ? "Posting..." : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default JobForm;