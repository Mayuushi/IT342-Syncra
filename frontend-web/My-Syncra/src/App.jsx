import './App.css'
import { LoadingScreen } from './Components/LoadingScreen'
import "./index.css"
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Components/Sections/Login'
import Register from './Components/Sections/Register'

function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  
  return (
    <Router>
      {!isLoaded ? (
        <LoadingScreen onComplete={() => setIsLoaded(true)}/>
      ) : (
        <div className={`min-h-screen transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Login />} /> {/* Redirect to login by default */}
          </Routes>
        </div>
      )}
    </Router>
  );
}

export default App