import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NavBar } from "../NavBar";
import companyService from "../../Service/companyService";
import authService from "../../Service/authService";
import { Building2, Globe, Mail, Phone, MapPin, Users, Briefcase, Calendar, DollarSign, Edit, Trash2, Clock, ChevronRight } from "lucide-react";

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
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-6 text-xl font-medium text-gray-700">Loading company details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center shadow-sm">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-2xl font-bold text-red-700 mb-2">Error loading company details</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <button 
              onClick={() => navigate("/company")}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
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
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center shadow-sm">
            <svg className="w-16 h-16 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-2xl font-bold text-yellow-700 mb-2">Company not found</h2>
            <button 
              onClick={() => navigate("/company")}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
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
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {company.logo ? (
              <div className="w-28 h-28 md:w-36 md:h-36 bg-white rounded-xl shadow-lg overflow-hidden flex items-center justify-center p-2 border-4 border-white">
                <img 
                  src={company.logo} 
                  alt={`${company.name} logo`} 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-28 h-28 md:w-36 md:h-36 bg-white rounded-xl shadow-lg overflow-hidden flex items-center justify-center p-2 border-4 border-white">
                <Building2 className="w-20 h-20 text-gray-300" />
              </div>
            )}
            
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white">{company.name}</h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4">
                {company.industry && (
                  <div className="flex items-center text-blue-100">
                    <Briefcase className="w-5 h-5 mr-2" />
                    <span className="font-medium">{company.industry}</span>
                  </div>
                )}
                {company.location && (
                  <div className="flex items-center text-blue-100">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span className="font-medium">{company.location}</span>
                  </div>
                )}
                {company.size && (
                  <div className="flex items-center text-blue-100">
                    <Users className="w-5 h-5 mr-2" />
                    <span className="font-medium">{company.size} employees</span>
                  </div>
                )}
              </div>
              
              {isOwner && (
                <div className="flex mt-6 gap-3">
                  <button 
                    onClick={handleEditCompany}
                    className="px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-colors shadow-sm flex items-center"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Company
                  </button>
                  <button 
                    onClick={handleDeleteCompany}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors shadow-sm flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left column - About & Job listings */}
          <div className="md:col-span-2 space-y-8">
            {/* About section */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center">
                <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                  <Building2 className="w-6 h-6" />
                </span>
                About {company.name}
              </h2>
              <div className="prose max-w-none text-gray-700 leading-relaxed">
                <p>{company.description || "No company description available."}</p>
              </div>
            </div>
            
            {/* Jobs section */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                    <Briefcase className="w-6 h-6" />
                  </span>
                  Open Positions
                </h2>
                {isOwner && (
                  <button 
                    onClick={handleAddJob}
                    className="px-4 py-2 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Post New Job
                  </button>
                )}
              </div>
              
              {jobs.length === 0 ? (
                <div className="py-8 text-center bg-gray-50 rounded-lg border border-gray-200">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500 text-lg mb-2">No open positions at the moment</p>
                  <p className="text-gray-400">Check back later for new opportunities</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div 
                      key={job.id} 
                      className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                      onClick={() => handleJobClick(job.id)}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">
                          {job.type || "Full-time"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                          <span>{job.location || "Remote"}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <DollarSign className="w-5 h-5 mr-2 text-gray-500" />
                          <span>{job.salary ? `$${job.salary}` : "Competitive"}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-5 h-5 mr-2 text-gray-500" />
                          <span>{job.experience || "Any experience"}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                          <span>Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                        <span className="flex items-center text-blue-600 font-medium group-hover:underline">
                          View details
                          <ChevronRight className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Right column - Contact info */}
          <div className="space-y-8">
            {/* Contact info card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center">
                <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                  <Mail className="w-5 h-5" />
                </span>
                Contact Information
              </h2>
              <ul className="space-y-5">
                {company.website && (
                  <li className="flex items-start">
                    <div className="p-2 bg-gray-100 rounded-lg mr-3">
                      <Globe className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Website</p>
                      <a 
                        href={company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {company.website}
                      </a>
                    </div>
                  </li>
                )}
                
                {company.email && (
                  <li className="flex items-start">
                    <div className="p-2 bg-gray-100 rounded-lg mr-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <a 
                        href={`mailto:${company.email}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {company.email}
                      </a>
                    </div>
                  </li>
                )}
                
                {company.phone && (
                  <li className="flex items-start">
                    <div className="p-2 bg-gray-100 rounded-lg mr-3">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Phone</p>
                      <a 
                        href={`tel:${company.phone}`}
                        className="text-gray-900 font-medium"
                      >
                        {company.phone}
                      </a>
                    </div>
                  </li>
                )}
                
                {company.location && (
                  <li className="flex items-start">
                    <div className="p-2 bg-gray-100 rounded-lg mr-3">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Location</p>
                      <p className="text-gray-900 font-medium">{company.location}</p>
                    </div>
                  </li>
                )}
                
                {company.industry && (
                  <li className="flex items-start">
                    <div className="p-2 bg-gray-100 rounded-lg mr-3">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Industry</p>
                      <p className="text-gray-900 font-medium">{company.industry}</p>
                    </div>
                  </li>
                )}
                
                {company.size && (
                  <li className="flex items-start">
                    <div className="p-2 bg-gray-100 rounded-lg mr-3">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Company Size</p>
                      <p className="text-gray-900 font-medium">{company.size} employees</p>
                    </div>
                  </li>
                )}
              </ul>
              
              {isOwner && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Owner Actions</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={handleEditCompany}
                      className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Company
                    </button>
                    <button 
                      onClick={handleDeleteCompany}
                      className="w-full py-2.5 px-4 bg-white border border-red-500 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Company
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyDetails;