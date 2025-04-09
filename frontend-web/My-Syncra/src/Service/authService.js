// src/services/authService.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/users';

// Register a new user and store in localStorage
const register = async ({ fullName, emailOrPhone, password }) => {
  try {
    const response = await axios.post(API_BASE_URL, {
      name: fullName,
      email: emailOrPhone,
      password,
    });

    const user = response.data;
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch (error) {
    const message =
      error.response?.data?.message || 'Registration failed. Please try again.';
    throw new Error(message);
  }
};

// Login a user and store in localStorage
const login = async ({ emailOrPhone, password }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/email/${emailOrPhone}`);
    const user = response.data.user;

    if (!user) throw new Error('User not found');

    // Plain-text password check (for demo only)
    if (user.password !== password) {
      throw new Error('Invalid password');
    }

    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch (error) {
    const message =
      error.response?.data?.message || 'Login failed. Please check your credentials.';
    throw new Error(message);
  }
};

// Logout and clear localStorage
const logout = () => {
  localStorage.removeItem('user');
};

// Get currently logged-in user
const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default authService;
