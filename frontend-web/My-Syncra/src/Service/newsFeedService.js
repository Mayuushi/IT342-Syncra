// src/services/newsFeedService.js

import axios from 'axios';
import authService from './authService';

const API_BASE_URL = 'https://it342-syncra.onrender.com/api/newsfeed';

// Get all posts
const getAllPosts = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data.posts || [];
  } catch (error) {
    console.error('Error fetching all posts:', error);
    const message = 
      error.response?.data?.message || 'Failed to fetch posts';
    throw new Error(message);
  }
};

// Get posts by user ID
const getPostsByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
    return response.data.posts || [];
  } catch (error) {
    console.error('Error fetching user posts:', error);
    const message = 
      error.response?.data?.message || 'Failed to fetch user posts';
    throw new Error(message);
  }
};

// Create a new post
const createPost = async (content, imageUrl = null) => {
  try {
    const currentUser = authService.getCurrentUser();
    
    if (!currentUser || !currentUser.id) {
      throw new Error('User not authenticated');
    }
    
    // Log for debugging
    console.log('Creating post with user ID:', currentUser.id);
    console.log('Post content:', content);
    
    // Create post with the expected structure from your backend
    const postData = {
      content: content,
      imageUrl: imageUrl || null,
      user: {
        id: currentUser.id
      }
    };
    
    const response = await axios.post(`${API_BASE_URL}/user/${currentUser.id}`, postData);
    return response.data.post;
  } catch (error) {
    console.error('Error details:', error.response?.data || error.message);
    const message = 
      error.response?.data?.message || 'Failed to create post';
    throw new Error(message);
  }
};

// Delete a post
const deletePost = async (postId) => {
  try {
    await axios.delete(`${API_BASE_URL}/${postId}`);
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    const message = 
      error.response?.data?.message || 'Failed to delete post';
    throw new Error(message);
  }
};

const newsFeedService = {
  getAllPosts,
  getPostsByUserId,
  createPost,
  deletePost
};

export default newsFeedService;