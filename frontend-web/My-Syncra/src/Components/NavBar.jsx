import React from 'react';
import { useNavigate } from 'react-router-dom';
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

function NavBar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="w-full">
        <div className="flex items-center h-16 pl-4 pr-4">
          {/* Logo and Syncra text */}
          <div
            className="navbar-logo"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/feed")}
          >
            <img src={logoImg} alt="Syncra Logo" />
            <span className="navbar-title">Syncra.</span>
          </div>

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

            {/* The NOTICES link below has been removed */}
            {/* 
            <Link
              to="/notices"
              className="flex flex-col items-center justify-center px-2 text-gray-600 hover:text-blue-600"
            >
              <FiBell className="h-5 w-5" />
              <span className="text-xs mt-1">NOTICES</span>
            </Link>
            */}
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
}

export default NavBar;
