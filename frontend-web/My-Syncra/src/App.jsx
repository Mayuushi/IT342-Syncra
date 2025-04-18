import './App.css'
import { LoadingScreen } from './Components/LoadingScreen'
import "./index.css"
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Components/Sections/Login'
import Register from './Components/Sections/Register'
import { NavBar } from './Components/NavBar'
import Feed from './Components/Sections/Feed'
import PrivateRoute from './Components/PrivateRoute'
import Chat from './Components/Sections/Chat'
import Network from './Components/Sections/Network'

function App() {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <Router>
      {!isLoaded ? (
        <LoadingScreen onComplete={() => setIsLoaded(true)} />
      ) : (
        <div className={`min-h-screen transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/feed"
              element={
                <PrivateRoute>
                  <Feed />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <NavBar />
                </PrivateRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              }
            />
            <Route
              path='/network'
              element={
                <PrivateRoute>
                  <Network />
                </PrivateRoute>
              }            
            
            />
          </Routes>
        </div>
      )}
    </Router>
  )
}

export default App