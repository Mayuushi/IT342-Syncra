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
import Profile from './Components/Sections/Profile'
import Portfolio from './Components/Sections/Portfolio'
import Job from './Components/Sections/Job'
import JobDetails from './Components/Sections/JobDetails'
import JobForm from './Components/Sections/JobForm'
import Companies from './Components/Sections/Companies'
import CompanyDetails from './Components/Sections/CompanyDetails'
import CompanyForm from './Components/Sections/CompanyForm'
import CompanyJobs from './Components/Sections/CompanyJobs'

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
            {/* Company Routes */}
            <Route
              path="/company"
              element={
                <PrivateRoute>
                  <Companies />
                </PrivateRoute>
              }
            />
            <Route
              path="/company/:id"
              element={
                <PrivateRoute>
                  <CompanyDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/companies/edit/:id"
              element={
                <PrivateRoute>
                  <CompanyForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/company/:id/edit"
              element={
                <PrivateRoute>
                  <CompanyForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/companyform"
              element={
                <PrivateRoute>
                  <CompanyForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/company/:id/post-job"
              element={
                <PrivateRoute>
                  <JobForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/jobs/create"
              element={
                <PrivateRoute>
                  <JobForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/company/:id/jobs"
              element={
                <PrivateRoute>
                  <CompanyJobs />
                </PrivateRoute>
              }
            />
            
            {/* Other routes */}
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
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
<Route
  path="/portfolio"
  element={
    <PrivateRoute>
      <Portfolio />
    </PrivateRoute>
  }
/>
<Route
  path="/portfolio/:userId"
  element={
    <PrivateRoute>
      <Portfolio />
    </PrivateRoute>
  }
/>
          
            {/* Job Routes */}
            <Route
              path="/jobs"
              element={
                <PrivateRoute>
                  <Job />
                </PrivateRoute>
              }
            />
            <Route
              path="/jobs/:jobId"
              element={
                <PrivateRoute>
                  <JobDetails />
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