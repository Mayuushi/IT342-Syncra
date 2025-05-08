import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NavBar } from "../NavBar";
import companyService from "../../Service/companyService";
import authService from "../../Service/authService";
import { Building2, Globe, Mail, Phone, MapPin, Users, Briefcase, Calendar, DollarSign } from "lucide-react";

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
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg font-medium text-gray-700">Loading company details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-red-700 mb-2">Error loading company details</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <button 
              onClick={() => navigate("/company")}
              className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Companies
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-yellow-700 mb-2">Company not found</h2>
            <button 
              onClick={() => navigate("/company")}
              className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Companies
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      {/* Hero section with company info */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {company.logo ? (
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-lg shadow-md overflow-hidden flex items-center justify-center p-2">
                <img 
                  src={company.logo} 
                  alt={`${company.name} logo`} 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-lg shadow-md flex items-center justify-center">
                <Building2 className="w-16 h-16 text-gray-400" />
              </div>
            )}
            
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{company.name}</h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3">
                {company.industry && (
                  <div className="flex items-center text-gray-700">
                    <Briefcase className="w-4 h-4 mr-1.5" />
                    <span>{company.industry}</span>
                  </div>
                )}
                {company.location && (
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-4 h-4 mr-1.5" />
                    <span>{company.location}</span>
                  </div>
                )}
                {company.size && (
                  <div className="flex items-center text-gray-700">
                    <Users className="w-4 h-4 mr-1.5" />
                    <span>{company.size}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-3 gap-6">
        {/* Left column - About & Contact */}
        <div className="md:col-span-2 space-y-6">
          {/* About section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About {company.name}</h2>
            <div className="prose max-w-none text-gray-700">
              <p>{company.description}</p>
            </div>
          </div>
          
          {/* Jobs section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Open Positions</h2>
              {isOwner && (
                <button 
                  onClick={handleAddJob}
                  className="px-4 py-2 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Post New Job
                </button>
              )}
            </div>
            
            {jobs.length === 0 ? (
              <p className="text-gray-500 italic py-4">No open positions at the moment.</p>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleJobClick(job.id)}
                  >
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-1.5 text-gray-500" />
                        <span>{job.location || "Remote"}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Briefcase className="w-4 h-4 mr-1.5 text-gray-500" />
                        <span>{job.type || "Full-time"}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="w-4 h-4 mr-1.5 text-gray-500" />
                        <span>{job.salary ? `$${job.salary}` : "Not specified"}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-1.5 text-gray-500" />
                        <span>Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-right">
                      <span className="text-blue-600 text-sm font-medium hover:underline">View details →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Right column - Contact info & Owner actions */}
        <div className="space-y-6">
          {/* Contact info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <ul className="space-y-4">
              {company.website && (
                <li className="flex items-start">
                  <Globe className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Website</p>
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate block"
                    >
                      {company.website}
                    </a>
                  </div>
                </li>
              )}
              
              {company.email && (
                <li className="flex items-start">
                  <Mail className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <a 
                      href={`mailto:${company.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {company.email}
                    </a>
                  </div>
                </li>
              )}
              
              {company.phone && (
                <li className="flex items-start">
                  <Phone className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phone</p>
                    <a 
                      href={`tel:${company.phone}`}
                      className="text-gray-900"
                    >
                      {company.phone}
                    </a>
                  </div>
                </li>
              )}
            </ul>
          </div>
          
          {/* Owner actions */}
          {isOwner && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Owner Actions</h2>
              <div className="space-y-3">
                <button 
                  onClick={handleEditCompany}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Edit Company
                </button>
                <button 
                  onClick={handleDeleteCompany}
                  className="w-full py-2.5 px-4 bg-white border border-red-500 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors"
                >
                  Delete Company
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompanyDetails;