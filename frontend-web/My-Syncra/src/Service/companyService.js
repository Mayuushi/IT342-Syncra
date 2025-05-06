import axios from "axios";
const API_URL = "/api/companies";

class CompanyService {
  // Create a new company
  createCompany(companyData, userId) {
    return axios.post(`${API_URL}?userId=${userId}`, companyData);
  }

  // Get company by ID
  getCompanyById(companyId) {
    return axios.get(`${API_URL}/${companyId}`);
  }

  // Get companies owned by user
  getUserCompanies(userId) {
    return axios.get(`${API_URL}/user/${userId}`);
  }

  // Update company details
  updateCompany(companyId, companyData, userId) {
    return axios.put(`${API_URL}/${companyId}?userId=${userId}`, companyData);
  }

  // Delete a company
  deleteCompany(companyId, userId) {
    return axios.delete(`${API_URL}/${companyId}?userId=${userId}`);
  }

  // Post a job as a company
  postJob(companyId, jobData, userId) {
    return axios.post(`${API_URL}/${companyId}/jobs?userId=${userId}`, jobData);
  }

  // Get all jobs posted by a company
  getCompanyJobs(companyId) {
    return axios.get(`${API_URL}/${companyId}/jobs`);
  }

  // Get all companies (for browsing)
  getAllCompanies() {
    return axios.get(API_URL);
  }
}

export default new CompanyService();