import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NavBar } from "../NavBar";
import companyService from "../../Service/companyService";
import authService from "../../Service/authService";
import "./CompanyForm.css";

function CompanyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    websiteUrl: "",
    logoUrl: "",
    industry: "",
    location: "",
    size: "",
    foundedDate: "",
    email: "",
    phone: ""
  });

  const isEditing = !!id;

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

  // If editing, fetch company data
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (isEditing && id) {
        try {
          setLoading(true);
          const response = await companyService.getCompanyById(id);
          const company = response.data;
          
          // Format date for input field if it exists
          let formattedDate = "";
          if (company.foundedDate) {
            const date = new Date(company.foundedDate);
            formattedDate = date.toISOString().split('T')[0];
          }
          
          setFormData({
            name: company.name || "",
            description: company.description || "",
            websiteUrl: company.websiteUrl || "",
            logoUrl: company.logoUrl || "",
            industry: company.industry || "",
            location: company.location || "",
            size: company.size || "",
            foundedDate: formattedDate,
            email: company.email || "",
            phone: company.phone || ""
          });
          setError(null);
        } catch (err) {
          console.error("Error fetching company data:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCompanyData();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      
      // Format date before sending to API
      const formattedData = { ...formData };
      if (formData.foundedDate) {
        formattedData.foundedDate = new Date(formData.foundedDate);
      }
      
      if (isEditing) {
        await companyService.updateCompany(id, formattedData, currentUser.id);
        alert("Company updated successfully!");
      } else {
        await companyService.createCompany(formattedData, currentUser.id);
        alert("Company created successfully!");
      }
      
      navigate("/company");
    } catch (err) {
      console.error("Error saving company:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/company");
  };

  return (
    <>
      <NavBar />
      <div className="company-container">
        <div className="company-form">
          <div className="company-form-header">
            <h1>{isEditing ? "Edit Company" : "Create Company"}</h1>
          </div>

          {loading && <div className="company-loading">Loading...</div>}

          {error && (
            <div className="company-error">
              Error: {error}
              <button onClick={() => window.location.reload()}>Try Again</button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="company-form-group">
              <label htmlFor="name">Company Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="company-form-control"
                required
              />
            </div>

            <div className="company-form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="company-form-control company-form-textarea"
              />
            </div>

            <div className="company-form-group">
              <label htmlFor="industry">Industry</label>
              <input
                type="text"
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="company-form-control"
              />
            </div>

            <div className="company-form-group">
              <label htmlFor="websiteUrl">Website URL</label>
              <input
                type="url"
                id="websiteUrl"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleChange}
                className="company-form-control"
                placeholder="https://example.com"
              />
            </div>

            <div className="company-form-group">
              <label htmlFor="logoUrl">Logo URL</label>
              <input
                type="url"
                id="logoUrl"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                className="company-form-control"
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div className="company-form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="company-form-control"
              />
            </div>

            <div className="company-form-group">
              <label htmlFor="size">Company Size</label>
              <select
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="company-form-control"
              >
                <option value="">Select company size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1001+">1001+ employees</option>
              </select>
            </div>

            <div className="company-form-group">
              <label htmlFor="foundedDate">Founded Date</label>
              <input
                type="date"
                id="foundedDate"
                name="foundedDate"
                value={formData.foundedDate}
                onChange={handleChange}
                className="company-form-control"
              />
            </div>

            <div className="company-form-group">
              <label htmlFor="email">Contact Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="company-form-control"
              />
            </div>

            <div className="company-form-group">
              <label htmlFor="phone">Contact Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="company-form-control"
              />
            </div>

            <div className="company-form-actions">
              <button
                type="button"
                className="company-form-cancel"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="company-form-submit"
                disabled={loading}
              >
                {isEditing ? "Update Company" : "Create Company"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CompanyForm;