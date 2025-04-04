import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Tailwind CSS</h1>
        <p className="text-gray-600 mb-6">
          Tailwind makes styling easy and responsive with utility-first classes.
        </p>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-300">
          Get Started
        </button>
      </div>
    </div>
  )
}

export default App
