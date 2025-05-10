import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../NavBar';
import authService from '../../Service/authService';

function Network() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Fetch all users from the API
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await authService.getUsers();
        setUsers(fetchedUsers);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again later.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (userId) => {
    // Navigate to the user's portfolio page
    navigate(`/portfolio/${userId}`);
  };

  // Current user for comparison
  const currentUser = authService.getCurrentUser();

  return (
    <>
      <NavBar />
      <div className="absolute top-[64px] left-0 w-screen h-[calc(100vh-64px)] bg-gray-100 flex flex-col md:flex-row overflow-hidden z-0">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 h-full mb-4 md:mb-0 md:mr-6 overflow-y-auto">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center mt-4 md:mt-2 ml-4">
            <div className="w-full bg-blue-500 rounded-lg p-6 flex flex-col items-center">
              <span className="text-white text-lg font-semibold text-center mb-4">
                Connect with<br />People<br />using Syncra
              </span>
              <button className="bg-white text-blue-600 font-semibold px-6 py-2 rounded-full shadow hover:bg-blue-50 transition">
                VIEW ALL
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 h-full overflow-y-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 mt-4 md:mt-0 px-4">
            <div className="flex items-center space-x-2 mt-3">
              <h2 className="text-2xl font-bold">Connections</h2>
              {!loading && !error && (
                <span className="bg-gray-200 px-2 py-0.5 rounded text-xs font-semibold">
                  {users.length}
                </span>
              )}
            </div>
            <div className="mt-2 md:mt-0 text-sm text-gray-500">
              sort by: <span className="font-semibold">Last Update</span>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center p-4 text-red-500">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 text-blue-500 underline"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Users Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-4">
              {users.map(user => (
                <div 
                  key={user.id} 
                  className="bg-white rounded-xl shadow p-4 flex flex-col items-center hover:shadow-lg transition cursor-pointer"
                  onClick={() => handleUserClick(user.id)}
                >
                  <div className="w-full flex flex-col items-center">
                    <div className="w-full h-16 bg-blue-200 rounded-t-lg flex items-end justify-center mb-[-2rem]">
                      {/* Decorative header */}
                    </div>
                    <img
                      src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.fullName || '')}&background=random`}
                      alt={user.name || user.fullName}
                      className="w-20 h-20 rounded-full border-4 border-white shadow -mt-8 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.fullName || '')}&background=random`;
                      }}
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <div className="font-semibold text-lg">{user.name || user.fullName}</div>
                    <div className="text-gray-500 text-sm">
                      {user.username || user.email || ''}
                    </div>
                  </div>
                  
                  {/* Show different button for current user */}
                  {currentUser && user.id === currentUser.id ? (
                    <button className="mt-4 bg-gray-200 text-gray-700 px-6 py-2 rounded-full font-semibold">
                      Your Profile
                    </button>
                  ) : (
                    <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-600 transition">
                      View Profile
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Network;