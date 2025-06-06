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
import portfolioService from '../../Service/PortfolioService'; // Import the portfolio service
import spacexImg from '../../assets/spacex.jpg';
import teslaImg from '../../assets/Tesla.jpg';
import xImg from '../../assets/x.png';

function Feed() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPost, setNewPost] = useState('');
  const [sortBy, setSortBy] = useState('Popular');
  const [postError, setPostError] = useState(null);
  const [portfolioProjects, setPortfolioProjects] = useState([]); // State for portfolio projects
  const [portfolioLoading, setPortfolioLoading] = useState(true); // Loading state for portfolio

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

  // Fetch portfolio projects
  useEffect(() => {
    const fetchPortfolioProjects = async () => {
      if (!currentUser || !currentUser.id) return;
      
      try {
        setPortfolioLoading(true);
        const response = await portfolioService.getUserPortfolios(currentUser.id);
        console.log("Fetched portfolio projects:", response.data);
        
        // Set the portfolio projects
        if (response.data && Array.isArray(response.data)) {
          setPortfolioProjects(response.data);
        } else {
          // Handle case where response is not as expected
          console.warn("Portfolio data is not in expected format:", response.data);
          setPortfolioProjects([]);
        }
      } catch (err) {
        console.error('Error fetching portfolio projects:', err);
        // Don't set a visible error for portfolio - just log it
      } finally {
        setPortfolioLoading(false);
      }
    };

    if (currentUser) {
      fetchPortfolioProjects();
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

  // Fallback portfolio projects in case API fails or returns empty
  const fallbackProjects = [
  ];

  // Determine which projects to display
  const projectsToDisplay = portfolioProjects.length > 0 
    ? portfolioProjects.slice(0, 3) 
    : fallbackProjects;

  const getProjectImage = (project) => {
    // If the project has an image URL, use it
    if (project.imageUrl) {
      return project.imageUrl;
    }
    
    // If it's a fallback project, it already has an image property
    if (project.image) {
      return project.image;
    }
    
    // Default placeholder image
    return 'https://via.placeholder.com/100';
  };

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
        style={{
          position: 'fixed',
          top: 64,
          left: 0,
          width: '100vw',
          height: 'calc(100vh - 64px)',
          background: '#f3f4f6',
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        <div className="flex w-full h-full">
          {/* LEFT SIDEBAR */}
          <div className="w-1/4 h-full space-y-2 overflow-y-auto">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-blue-500 h-16 relative">
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User profile"
                    className="rounded-full border-2 border-white w-16 h-16"
                  />
                </div>
              </div>
              <div className="pt-10 pb-2 px-3 text-center border-b border-gray-200">
                <h2 className="text-lg font-bold">{currentUser?.name || 'LOADING...'}</h2>
                <p className="text-gray-500 text-xs">
                </p>
              </div>
              <div className="px-3 py-2 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500"></span>
                  <span className="text-xs text-blue-500"></span>
                </div>
                <p className="text-xs text-gray-500">
                </p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">Profile views</span>
                  <span className="text-xs text-blue-500">3</span>
                </div>
              </div>
              <div className="px-3 py-2 border-b border-gray-200">
                <p className="text-xs">
                </p>
                <p className="text-xs font-medium text-amber-600">
                </p>
              </div>
              <div className="px-3 py-2">
                <p className="text-xs flex items-center">🔖 My elements</p>
              </div>
              {/* Add Edit Profile button */}
              <div className="px-3 pb-3">
                <button
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold py-1 rounded transition"
                  onClick={() => navigate('/profile')}
                >
                  Edit profile
                </button>
              </div>
            </div>

            {/* Overview Section (User Portfolio Projects) */}
            <div className="bg-white rounded-lg shadow-sm p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-sm">Projects</h3>
                <button
                  className="text-xs font-semibold text-blue-600 hover:underline px-2 py-1 rounded transition"
                  onClick={() => navigate('/portfolio')}
                  style={{ background: "#e3e9f7" }}
                >
                  View Portfolio
                </button>
              </div>
              
              {portfolioLoading ? (
                <div className="text-center py-2">
                  <p className="text-xs text-gray-500">Loading projects...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {projectsToDisplay.map((project) => (
                    <div key={project.id} className="flex items-center space-x-2">
                      <img 
                        src={getProjectImage(project)} 
                        alt={project.title || project.name} 
                        className="w-12 h-12 rounded object-cover" 
                      />
                      <div>
                        <div className="font-semibold text-xs text-gray-800">
                          {project.title || project.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {project.description || project.summary || 'No description'}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {projectsToDisplay.length === 0 && (
                    <div className="text-center py-2">
                      <p className="text-xs text-gray-500">No projects found</p>
                      <button 
                        className="text-xs text-blue-500 hover:underline mt-1"
                        onClick={() => navigate('/portfolio/new')}
                      >
                        Empty
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* End Overview Section */}
          </div>

          {/* MAIN FEED */}
          <div className="w-1/2 h-full overflow-y-auto px-2">
            {/* Create Post */}
            <div className="bg-white rounded-lg shadow-sm p-3 mb-2 mt-4">
              {postError && (
                <div className="bg-red-50 text-red-500 p-2 rounded mb-2 text-xs">
                  <p>Error creating post: {postError}</p>
                </div>
              )}
              <div className="flex items-center mb-2">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User"
                  className="rounded-full mr-2 w-9 h-9"
                />
                <form onSubmit={handleSubmitPost} className="w-full">
                  <input
                    type="text"
                    placeholder="New publication"
                    className="w-full p-2 text-sm border border-gray-300 rounded-full"
                    value={newPost}
                    onChange={handlePostChange}
                  />
                </form>
              </div>
              <div className="flex justify-between">
                <button className="flex items-center text-gray-600 hover:bg-gray-100 px-2 py-1 rounded text-xs">
                  <span className="bg-blue-100 text-blue-500 p-1 rounded mr-1">
                    📷
                  </span>
                  A photo
                </button>
                <button className="flex items-center text-gray-600 hover:bg-gray-100 px-2 py-1 rounded text-xs">
                  <span className="bg-green-100 text-green-500 p-1 rounded mr-1">
                    🎥
                  </span>
                  Video
                </button>
                <button className="flex items-center text-gray-600 hover:bg-gray-100 px-2 py-1 rounded text-xs">
                  <span className="bg-amber-100 text-amber-500 p-1 rounded mr-1">
                    📅
                  </span>
                  Event
                </button>
                <button 
                  className="flex items-center text-gray-600 hover:bg-gray-100 px-2 py-1 rounded text-xs"
                  onClick={handleSubmitPost}
                >
                  <span className="bg-red-100 text-red-500 p-1 rounded mr-1">
                    📝
                  </span>
                  Post
                </button>
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex justify-end items-center mb-2">
              <span className="text-xs text-gray-500 mr-1">Sort:</span>
              <div className="relative">
                <select
                  className="appearance-none bg-transparent border-none pr-6 py-0.5 focus:outline-none text-xs font-medium"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option>Popular</option>
                  <option>Recent</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
                  <svg
                    className="fill-current h-3 w-3"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Loading and Error States */}
            {loading && (
              <div className="bg-white rounded-lg shadow-sm p-4 mb-2 text-center">
                <p>Loading posts...</p>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 text-red-500 rounded-lg shadow-sm p-4 mb-2">
                <p>Error: {error}</p>
                <button 
                  className="text-blue-500 underline mt-2"
                  onClick={() => window.location.reload()}
                >
                  Try again
                </button>
              </div>
            )}

            {/* Posts */}
            {!loading && posts.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4 mb-2 text-center">
                <p>No posts yet. Be the first to post something!</p>
              </div>
            )}

            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-sm mb-2 overflow-hidden"
              >
                <div className="p-3">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <img
                        src={post.user.profileImage}
                        alt={post.user.name}
                        className="w-10 h-10 rounded-full mr-2"
                      />
                      <div>
                        <h3 className="font-medium text-sm">
                          {post.user.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {post.user.followers}
                        </p>
                        {post.user.isPromoted && (
                          <p className="text-xs text-gray-500">Promoted</p>
                        )}
                      </div>
                    </div>
                    <button className="text-gray-400">
                      <FiMoreHorizontal size={14} />
                    </button>
                  </div>
                  <p className="my-2 text-sm">{post.content}</p>
                  {post.images && post.images.length > 0 && post.images[0] && (
                    <div className="mt-1">
                      <img
                        src={post.images[0]}
                        alt="Post content"
                        className="w-full h-auto rounded-md"
                      />
                    </div>
                  )}
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <div className="flex items-center">
                      <span className="flex items-center">
                        <span className="bg-blue-500 text-white rounded-full p-0.5 text-xs mr-1">
                          <FiHeart className="h-2 w-2" />
                        </span>
                        {post.likes}
                      </span>
                    </div>
                    <div>
                      <span>
                        {post.comments} comments • {post.shares} shares
                      </span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200">
                  <div className="flex justify-between p-1">
                    <button className="flex items-center justify-center w-1/4 py-1 text-gray-500 hover:bg-gray-100 rounded text-xs">
                      <FiHeart className="mr-1" size={12} />
                      Like
                    </button>
                    <button className="flex items-center justify-center w-1/4 py-1 text-gray-500 hover:bg-gray-100 rounded text-xs">
                      <FiMessageSquare className="mr-1" size={12} />
                      Comment
                    </button>
                    <button className="flex items-center justify-center w-1/4 py-1 text-gray-500 hover:bg-gray-100 rounded text-xs">
                      <FiShare2 className="mr-1" size={12} />
                      Share
                    </button>
                    <button className="flex items-center justify-center w-1/4 py-1 text-gray-500 hover:bg-gray-100 rounded text-xs">
                      <FiSend className="mr-1" size={12} />
                      Send
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT SIDEBAR */}
        
            {/* General Information */}
          </div>
        </div>
    </>
  );
}

export default Feed;