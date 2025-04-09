import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiRss,
  FiBriefcase,
  FiBell,
  FiMessageSquare,
  FiUsers,
  FiLogOut,
} from 'react-icons/fi';
import logo from '../assets/logo.png'; // Import the logo image

export const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add any logout logic here (clearing tokens, etc.)
    // Then navigate to login page
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white z-40 backdrop-blur-lg border-b border-gray-200 shadow-lg">
      <div className="w-full">
        <div className="flex items-center h-16 pl-4 pr-4">
          {/* Logo and Syncra text */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Syncra Logo" className="h-8 w-auto mr-2" />
            <span className="text-3xl font-bold text-blue-600">Syncra.</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex ml-6 space-x-4">
            {/* ... existing code ... */}
            <Link
              to="/feed"
              className="flex flex-col items-center justify-center px-2 text-gray-600 hover:text-blue-600"
            >
              <FiRss className="h-5 w-5" />
              <span className="text-xs mt-1">FEED</span>
            </Link>

            <Link
              to="/network"
              className="flex flex-col items-center justify-center px-2 text-gray-600 hover:text-blue-600"
            >
              <FiUsers className="h-5 w-5" />
              <span className="text-xs mt-1">NETWORK</span>
            </Link>

            <Link
              to="/jobs"
              className="flex flex-col items-center justify-center px-2 text-gray-600 hover:text-blue-600"
            >
              <FiBriefcase className="h-5 w-5" />
              <span className="text-xs mt-1">JOBS</span>
            </Link>

            <Link
              to="/chat"
              className="flex flex-col items-center justify-center px-2 text-gray-600 hover:text-blue-600"
            >
              <FiMessageSquare className="h-5 w-5" />
              <span className="text-xs mt-1">CHAT</span>
            </Link>

            <Link
              to="/notices"
              className="flex flex-col items-center justify-center px-2 text-gray-600 hover:text-blue-600"
            >
              <FiBell className="h-5 w-5" />
              <span className="text-xs mt-1">NOTICES</span>
            </Link>
          </div>

          {/* Search Bar (moved closer to Nav Links) */}
          <div className="hidden md:flex flex-1 items-center justify-start px-2 ml-4">
            {/* ... existing code ... */}
            <div className="w-full max-w-xl">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-100 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search"
                  type="search"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0 relative">
              <div className="flex items-center">
                <img
                  className="h-8 w-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User profile"
                />
                <div className="ml-2 hidden md:block">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">USERNAME</div>
                    <div className="ml-2 text-xs font-medium text-blue-600">YOU</div>
                  </div>
                  <div className="text-xs text-gray-500">
                    0 views today <span className="text-green-500">+0</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="ml-4 flex items-center">
              {/* Replaced "Others" with Logout button */}
              <button 
                onClick={handleLogout}
                className="p-1 rounded-full text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <span className="sr-only">Logout</span>
                <div className="flex flex-col items-center">
                  <FiLogOut className="h-5 w-5" />
                  <span className="text-xs mt-1">LOGOUT</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};