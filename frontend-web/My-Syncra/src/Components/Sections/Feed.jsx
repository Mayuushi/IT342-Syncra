import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../NavBar';
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
import coverImg from '../../assets/cover.jpg'; // <-- Add this import
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

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
              <div
                className="h-16 relative"
                style={{
                  background: `url(${coverImg}) center center/cover no-repeat`
                }}
              >
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
                  Frontend Web Developer
                </p>
              </div>
              <div className="px-3 py-2 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Contacts</span>
                  <span className="text-xs text-blue-500">fifty</span>
                </div>
                <p className="text-xs text-gray-500">
                  090-1234-5678, 090-1234-5678
                </p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">Profile views</span>
                  <span className="text-xs text-blue-500">3</span>
                </div>
              </div>
              <div className="px-3 py-2 border-b border-gray-200">
                <p className="text-xs">
                  Access to exclusive tools and statistics
                </p>
                <p className="text-xs font-medium text-amber-600">
                  🔶 Try Premium for free
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
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <img src={spacexImg} alt="SpaceX Project" className="w-12 h-12 rounded object-cover" />
                  <div>
                    <div className="font-semibold text-xs text-gray-800">SpaceX</div>
                    <div className="text-xs text-gray-500">Rocket Launch Platform</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <img src={teslaImg} alt="Tesla Project" className="w-12 h-12 rounded object-cover" />
                  <div>
                    <div className="font-semibold text-xs text-gray-800">Tesla</div>
                    <div className="text-xs text-gray-500">Electric Vehicles</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <img src={xImg} alt="X Project" className="w-12 h-12 rounded object-cover" />
                  <div>
                    <div className="font-semibold text-xs text-gray-800">X</div>
                    <div className="text-xs text-gray-500">Social Platform</div>
                  </div>
                </div>
              </div>
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
          <div className="w-1/4 h-full overflow-y-auto mt-4">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-3 border-b border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-sm">Add to your feed</h3>
                  <button className="text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>
                {recommendedUsers.map((user) => (
                  <div key={user.id} className="mb-2">
                    <div className="flex items-center">
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium text-xs text-gray-900">{user.name}</span>
                        <span className="text-xs text-gray-500">{user.info}</span>
                      </div>
                    </div>
                    <div className="ml-10">
                      <button className="mt-1 border border-gray-300 rounded-full px-2 py-0.5 text-xs flex items-center">
                        <span className="mr-1">+</span> track
                      </button>
                    </div>
                  </div>
                ))}
                <button className="text-xs text-gray-500 flex items-center">
                  See all recommendations
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              <div className="overflow-hidden border-b border-gray-200">
                <a
                  href="https://www.apple.com/macbook-air/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:bg-gray-50 transition"
                >
                  <img
                    src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80"
                    alt="MacBook Air Advertisement"
                    className="w-full h-auto"
                  />
                  <div className="p-2">
                    <div className="font-bold text-sm text-gray-800">MacBook Air</div>
                    <div className="text-xs text-gray-600">Light. Speed. Power. Discover the new MacBook Air at Apple.</div>
                  </div>
                </a>
              </div>
            </div>
            {/* General Information */}
            <div className="bg-white rounded-lg shadow-sm mt-2 p-3">
              <p className="text-center text-xs text-gray-500 mb-1">
                General information
              </p>
              <div className="flex flex-wrap text-xs text-gray-500 justify-center">
                <span className="mx-1 my-0.5 text-[10px]">Special abilities</span>
                <span className="mx-1 my-0.5 text-[10px]">Advertising</span>
                <span className="mx-1 my-0.5 text-[10px]">Business</span>
                <span className="mx-1 my-0.5 text-[10px]">Marketing</span>
                <span className="mx-1 my-0.5 text-[10px]">Web</span>
                <span className="mx-1 my-0.5 text-[10px]">Development</span>
                <span className="mx-1 my-0.5 text-[10px]">Design</span>
                <span className="mx-1 my-0.5 text-[10px]">More</span>
              </div>
              <div className="text-center text-gray-400 text-[10px] mt-2">
                © 2024 MySyncra
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Feed;
