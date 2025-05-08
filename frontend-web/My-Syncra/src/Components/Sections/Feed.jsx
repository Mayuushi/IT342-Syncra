import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../NavBar';
import {
  FiHeart,
  FiMessageSquare,
  FiShare2,
  FiSend,
  FiMoreHorizontal,
} from 'react-icons/fi';
import authService from '../../Service/authService';
import newsFeedService from '../../Service/newsFeedService';
import spacexImg from '../../assets/spacex.jpg';
import teslaImg from '../../assets/Tesla.jpg';
import xImg from '../../assets/x.png';
import "./Feed.css"; // Make sure you have this or similar for custom styles

function Feed() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPost, setNewPost] = useState('');
  const [sortBy, setSortBy] = useState('Popular');
  const [postError, setPostError] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      navigate("/login");
    } else {
      console.log("Current user:", user);
      setCurrentUser(user);
    }
  }, [navigate]);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const fetchedPosts = await newsFeedService.getAllPosts();
        console.log("Fetched posts:", fetchedPosts);
        setPosts(fetchedPosts);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchPosts();
    }
  }, [currentUser]);

  const handlePostChange = (e) => {
    setNewPost(e.target.value);
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (newPost.trim()) {
      try {
        setPostError(null);

        // Get user details
        const user = authService.getCurrentUser();
        if (!user || !user.id) {
          throw new Error("User not logged in properly. Please log in again.");
        }

        // Log for debugging
        console.log("Creating post as user:", user);
        console.log("Post content:", newPost);

        // Try to create the post
        const createdPost = await newsFeedService.createPost(newPost);
        console.log("Post created successfully:", createdPost);
        
        // Create a formatted post object to match our UI requirements
        const newPostObj = {
          id: createdPost?.id || `temp-${Date.now()}`,
          user: {
            name: user.name || 'You',
            followers: '1,234 followers', // placeholder
            profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", // match Profile Card
            isPromoted: false,
          },
          content: newPost,
          images: [], // No images for now
          likes: 0,
          comments: 0,
          shares: 0,
          timestamp: 'Just now',
        };
        
        // Add the new post to the top of the list
        setPosts(prevPosts => [newPostObj, ...prevPosts]);
        setNewPost(''); // Clear the input
      } catch (err) {
        console.error('Error submitting post:', err);
        setPostError(err.message);
      }
    }
  };

  // Format backend posts to match our frontend structure
  const formatBackendPosts = (backendPosts) => {
    return backendPosts.map(post => ({
      id: post.id || `post-${Math.random().toString(36).substr(2, 9)}`,
      user: {
        name: post.user?.name || 'Unknown User',
        followers: '1,234 followers', // placeholder
        profileImage: post.user?.profilePicture || 'https://via.placeholder.com/50',
        isPromoted: false,
      },
      content: post.content || 'No content',
      images: post.imageUrl ? [post.imageUrl] : [],
      likes: 0, // Backend doesn't have likes yet
      comments: 0, // Backend doesn't have comments yet
      shares: 0, // Backend doesn't have shares yet
      timestamp: post.createdAt ? new Date(post.createdAt).toLocaleString() : 'Recently',
    }));
  };

  // Apply the formatting when posts change
  useEffect(() => {
    if (Array.isArray(posts) && posts.length > 0 && posts[0].user && !posts[0].user.name) {
      setPosts(formatBackendPosts(posts));
    }
  }, [posts]);

  const recommendedUsers = [
    {
      id: 1,
      name: 'Marie Clark',
      info: 'Graphics Designer',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    {
      id: 2,
      name: 'Mark Tini',
      info: 'Software Engineer',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      id: 3,
      name: 'Zander Kutsko',
      info: 'Data Analyst',
      image:  'https://randomuser.me/api/portraits/men/85.jpg',
    },
  ];

  return (
    <>
      <NavBar />
      <div
        className="feed-root"
        style={{
          minHeight: "100vh",
          width: "100vw",
          background: "linear-gradient(135deg, #1a6ed8 0%, #e3e9f7 100%)",
          paddingTop: 64,
          overflowX: "hidden",
          boxSizing: "border-box",
        }}
      >
        <div
          className="feed-container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 32,
            width: "100%",
            maxWidth: 1200,
            margin: "0 auto",
            padding: "32px 12px",
            boxSizing: "border-box",
          }}
        >
          {/* LEFT SIDEBAR */}
          <aside
            className="feed-sidebar"
            style={{
              width: 320,
              minWidth: 260,
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 4px 24px rgba(26,110,216,0.10)",
              padding: "28px 20px",
              marginBottom: 24,
              boxSizing: "border-box",
            }}
          >
            {/* ... Profile Card and Projects ... */}
          </aside>

          {/* MAIN FEED */}
          <main
            className="feed-main"
            style={{
              flex: 1,
              maxWidth: 600,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {/* ... Create Post, Sort Options, Posts ... */}
          </main>

          {/* RIGHT SIDEBAR */}
          <aside
            className="feed-right-sidebar"
            style={{
              width: 320,
              minWidth: 260,
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 4px 24px rgba(26,110,216,0.10)",
              padding: "20px 16px",
              marginBottom: 24,
              boxSizing: "border-box",
              marginTop: 16,
              height: "fit-content",
            }}
          >
            {/* ... Recommendations, Ads, General Info ... */}
          </aside>
        </div>
      </div>
    </>
  );
}

export default Feed;
