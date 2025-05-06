import axios from "axios";
import authHeader from "./authHeader";

const API_URL = "/api/companies";

class CompanyService {
  // Create a new company
  createCompany(companyData, userId) {
    return axios.post(`${API_URL}?userId=${userId}`, companyData, {
      headers: authHeader(),
    });
  }

  // Get company by ID
  getCompanyById(companyId) {
    return axios.get(`${API_URL}/${companyId}`, {
      headers: authHeader(),
    });
  }

  // Get companies owned by user
  getUserCompanies(userId) {
    return axios.get(`${API_URL}/user/${userId}`, {
      headers: authHeader(),
    });
  }

  // Update company details
  updateCompany(companyId, companyData, userId) {
    return axios.put(`${API_URL}/${companyId}?userId=${userId}`, companyData, {
      headers: authHeader(),
    });
  }

  // Delete a company
  deleteCompany(companyId, userId) {
    return axios.delete(`${API_URL}/${companyId}?userId=${userId}`, {
      headers: authHeader(),
    });
  }

  // Post a job as a company
  postJob(companyId, jobData, userId) {
    return axios.post(`${API_URL}/${companyId}/jobs?userId=${userId}`, jobData, {
      headers: authHeader(),
    });
  }

  // Get all jobs posted by a company
  getCompanyJobs(companyId) {
    return axios.get(`${API_URL}/${companyId}/jobs`, {
      headers: authHeader(),
    });
  }

  // Get all companies (for browsing)
  getAllCompanies() {
    return axios.get(API_URL);
  }
}

export default new CompanyService();