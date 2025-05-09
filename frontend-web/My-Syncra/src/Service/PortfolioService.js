// src/services/PortfolioService.js
import axios from 'axios';

const API_URL = 'https://it342-syncra.onrender.com/api/portfolio';

class PortfolioService {
  // Create a new portfolio project
  createPortfolio(userId, portfolioData) {
    return axios.post(`${API_URL}/user/${userId}`, portfolioData);
  }

  // Get all portfolios
  getAllPortfolios() {
    return axios.get(`${API_URL}`);
  }

  // Get portfolios by user ID
  getUserPortfolios(userId) {
    return axios.get(`${API_URL}/user/${userId}`);
  }

  // Delete a portfolio
  deletePortfolio(id) {
    return axios.delete(`${API_URL}/${id}`);
  }
}

export default new PortfolioService();