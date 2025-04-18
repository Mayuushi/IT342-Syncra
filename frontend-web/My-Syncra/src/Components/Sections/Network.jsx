import React from 'react';
import { NavBar } from '../NavBar';

const users = [
  {
    id: 1,
    name: 'Marie Clark',
    username: '@marie',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    id: 2,
    name: 'Kathleen Sink',
    username: '@kathleen',
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    id: 3,
    name: 'Steve Korn',
    username: '@stevekorn',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: 4,
    name: 'Tom Karen',
    username: '@Tommyy',
    image: 'https://randomuser.me/api/portraits/men/85.jpg',
  },
  {
    id: 5,
    name: 'Mark Seeds',
    username: '@seeds',
    image: 'https://randomuser.me/api/portraits/men/86.jpg',
  },
  {
    id: 6,
    name: 'Steve Jobs',
    username: '@stevejobs',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
];

function Network() {
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
                <span className="bg-gray-200 px-2 py-0.5 rounded text-xs font-semibold">1,043</span>
              </div>
              <div className="mt-2 md:mt-0 text-sm text-gray-500">
                sort by: <span className="font-semibold">Last Update</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-4">
              {users.map(user => (
                <div key={user.id} className="bg-white rounded-xl shadow p-4 flex flex-col items-center hover:shadow-lg transition">
                  <div className="w-full flex flex-col items-center">
                    <div className="w-full h-16 bg-blue-200 rounded-t-lg flex items-end justify-center mb-[-2rem]">
                      {/* Decorative header */}
                    </div>
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-20 h-20 rounded-full border-4 border-white shadow -mt-8 object-cover"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <div className="font-semibold text-lg">{user.name}</div>
                    <div className="text-gray-500 text-sm">{user.username}</div>
                  </div>
                  <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-600 transition">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

export default Network