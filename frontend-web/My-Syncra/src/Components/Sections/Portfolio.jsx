import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NavBar } from "../NavBar";
import coverImg from "../../assets/cover.jpg";
import "./Portfolio.css";
import PortfolioService from "../../Service/PortfolioService";
import authService from "../../Service/authService";

function Portfolio() {
  const { userId } = useParams(); // Get the userId from URL params
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewedUser, setViewedUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [newProject, setNewProject] = useState({
    projectTitle: "",
    description: "",
    imageUrl: ""
  });
  const [showAddForm, setShowAddForm] = useState(false);

  // Get current user (logged in user)
  const currentUser = authService.getCurrentUser();

  // Check if viewing own profile or someone else's
  const isOwnProfile = currentUser && userId ? currentUser.id === parseInt(userId) : true;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setLoadingUser(true);
      
      try {
        // If we have a userId from params, fetch that specific user
        if (userId) {
          try {
            // You'll need to add a getUser function to your authService
            const response = await fetch(`https://it342-syncra.onrender.com/api/users/${userId}`);
            if (!response.ok) throw new Error("Failed to fetch user");
            const data = await response.json();
            setViewedUser(data.user);
          } catch (err) {
            console.error("Error fetching user:", err);
            setError("User not found");
          } finally {
            setLoadingUser(false);
          }
          
          // Fetch portfolios for the specific user
          const portfolioResponse = await PortfolioService.getUserPortfolios(userId);
          setProjects(portfolioResponse.data);
        } else if (currentUser && currentUser.id) {
          // If no userId in URL but we're logged in, show own portfolio
          setViewedUser(currentUser);
          setLoadingUser(false);
          
          const portfolioResponse = await PortfolioService.getUserPortfolios(currentUser.id);
          setProjects(portfolioResponse.data);
        } else {
          // If neither userId nor current user, show all portfolios
          const portfolioResponse = await PortfolioService.getAllPortfolios();
          setProjects(portfolioResponse.data);
          setLoadingUser(false);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching portfolio data:", err);
        setError("Failed to load projects");
        setLoading(false);
        setLoadingUser(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleAddProject = (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError("You must be logged in to add projects");
      return;
    }
    
    PortfolioService.createPortfolio(currentUser.id, newProject)
      .then(response => {
        // Add the new project to the list
        setProjects([...projects, response.data]);
        // Reset form
        setNewProject({
          projectTitle: "",
          description: "",
          imageUrl: ""
        });
        setShowAddForm(false);
      })
      .catch(err => {
        console.error("Error creating portfolio:", err);
        setError("Failed to add project");
      });
  };

  const handleDeleteProject = (id) => {
    if (!currentUser) {
      setError("You must be logged in to delete projects");
      return;
    }
    
    if (window.confirm("Are you sure you want to delete this project?")) {
      PortfolioService.deletePortfolio(id)
        .then(() => {
          // Remove the deleted project from state
          const updatedProjects = projects.filter(project => project.id !== id);
          setProjects(updatedProjects);
          
          // Update current index if needed
          if (current >= updatedProjects.length) {
            setCurrent(Math.max(0, updatedProjects.length - 1));
          }
        })
        .catch(err => {
          console.error("Error deleting portfolio:", err);
          setError("Failed to delete project");
        });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject({
      ...newProject,
      [name]: value
    });
  };

  const handlePrev = () => {
    if (projects.length === 0) return;
    setCurrent((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (projects.length === 0) return;
    setCurrent((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  const goBack = () => {
    navigate('/network');
  };

  return (
    <>
      <NavBar />
      <div style={{ background: "#f7f9fb", minHeight: "100vh", width: "100%", paddingTop: 64 }}>
        {/* Back button */}
        {userId && (
          <button 
            onClick={goBack}
            style={{
              position: "absolute",
              top: 74,
              left: 20,
              background: "rgba(255,255,255,0.8)",
              border: "none",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 10,
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
            }}
          >
            <span style={{ fontSize: 24 }}>←</span>
          </button>
        )}
        
        {/* Cover Banner */}
        <div style={{
          width: "100%",
          height: 180,
          background: `url(${coverImg}) center center/cover no-repeat`,
          position: "relative",
        }}>
        </div>

        {/* Profile Card */}
        <div style={{
          maxWidth: 1100,
          margin: "0 auto",
          marginTop: -60,
          marginBottom: 32,
          background: "#fff",
          borderRadius: 10,
          boxShadow: "0 4px 24px rgba(26,110,216,0.10)",
          padding: "32px 32px 24px 32px",
          display: "flex",
          alignItems: "center",
          position: "relative",
        }}>
          <div style={{
            position: "relative",
            marginRight: 32,
            marginLeft: 12,
          }}>
            {loadingUser ? (
              <div style={{
                width: 110,
                height: 110,
                borderRadius: "50%",
                border: "4px solid #fff",
                background: "#e3e9f7",
                boxShadow: "0 2px 12px rgba(26,110,216,0.10)",
                position: "absolute",
                top: -70,
                left: 0,
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <div style={{ 
                  width: 30, 
                  height: 30, 
                  border: "3px solid #1a6ed8",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite"
                }}></div>
              </div>
            ) : (
              <img
                src={viewedUser?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(viewedUser?.fullName || viewedUser?.name || viewedUser?.username || '')}&background=random`}
                alt="Profile"
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: "50%",
                  border: "4px solid #fff",
                  objectFit: "cover",
                  background: "#e3e9f7",
                  boxShadow: "0 2px 12px rgba(26,110,216,0.10)",
                  position: "absolute",
                  top: -70,
                  left: 0,
                  zIndex: 2,
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(viewedUser?.fullName || viewedUser?.name || viewedUser?.username || '')}&background=random`;
                }}
              />
            )}
            <div style={{ width: 110, height: 40 }}></div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "block", textAlign: "left", marginBottom: 6 }}>
              <span style={{ fontSize: "1.25rem", fontWeight: 700, marginRight: 10, marginBottom: 6, display: "block" }}>
                {loadingUser 
                  ? "Loading..." 
                  : viewedUser 
                    ? viewedUser.fullName || viewedUser.name || viewedUser.username 
                    : "Guest User"}
              </span>
              {viewedUser?.location && (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <svg width="16" height="16" fill="#1a6ed8" style={{ marginRight: 4, verticalAlign: "middle" }} viewBox="0 0 20 20">
                    <path d="M10 2C6.13 2 3 5.13 3 9c0 5.25 7 9 7 9s7-3.75 7-9c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 10 6a2.5 2.5 0 0 1 0 5.5z"/>
                  </svg>
                  <span style={{ color: "#1a6ed8", fontSize: "1rem" }}>
                    {viewedUser.location}
                  </span>
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button style={{
                background: "#1a6ed8",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "7px 18px",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
              }}>CONTACT INFO</button>
              
              {isOwnProfile && (
                <button 
                  style={{
                    background: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "7px 18px",
                    fontWeight: 600,
                    fontSize: "1rem",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowAddForm(!showAddForm)}
                >
                  {showAddForm ? "CANCEL" : "ADD PROJECT"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Add Project Form */}
        {showAddForm && (
          <div style={{
            maxWidth: 1100,
            margin: "0 auto 24px auto",
            background: "#fff",
            borderRadius: 10,
            boxShadow: "0 4px 24px rgba(26,110,216,0.10)",
            padding: "24px",
          }}>
            <h3 style={{ marginBottom: 16 }}>Add New Project</h3>
            {error && <div style={{ color: "red", marginBottom: 16 }}>{error}</div>}
            <form onSubmit={handleAddProject}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Title</label>
                <input 
                  type="text" 
                  name="projectTitle" 
                  value={newProject.projectTitle}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "1px solid #ddd",
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Description</label>
                <textarea 
                  name="description" 
                  value={newProject.description}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "1px solid #ddd",
                    minHeight: 100,
                    resize: "vertical",
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Image URL</label>
                <input 
                  type="url" 
                  name="imageUrl" 
                  value={newProject.imageUrl}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "1px solid #ddd",
                  }}
                  required
                />
              </div>
              <div>
                <button 
                  type="submit" 
                  style={{
                    background: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "10px 24px",
                    fontWeight: 600,
                    fontSize: "1rem",
                    cursor: "pointer",
                  }}
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Error Display */}
        {error && !showAddForm && (
          <div style={{
            maxWidth: 1100,
            margin: "0 auto 24px auto",
            padding: "12px 24px",
            background: "#ffdddd",
            borderRadius: 8,
            color: "#d32f2f",
          }}>
            {error}
          </div>
        )}

        {/* Projects Section */}
        <div style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          gap: 24,
          alignItems: "flex-start",
          marginBottom: 48,
          flexDirection: window.innerWidth < 768 ? "column" : "row",
        }}>
          {/* Carousel */}
          <div style={{
            flex: 2,
            background: "#fff",
            borderRadius: 10,
            boxShadow: "0 4px 24px rgba(26,110,216,0.10)",
            padding: "32px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: 420,
            position: "relative",
          }}>
            <div style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: 18, alignSelf: "flex-start" }}>Projects</div>
            
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 320 }}>
                <div style={{ 
                  width: 50, 
                  height: 50, 
                  border: "4px solid #f3f3f3",
                  borderTop: "4px solid #1a6ed8",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite"
                }}></div>
              </div>
            ) : projects.length === 0 ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 320 }}>
                <div>
                  {isOwnProfile 
                    ? "No projects available. Click 'ADD PROJECT' to create one." 
                    : "This user hasn't added any projects yet."}
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "2.2rem",
                      color: "#1a6ed8",
                      cursor: "pointer",
                      padding: "0 18px",
                      userSelect: "none",
                      lineHeight: 1,
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={handlePrev}
                    aria-label="Previous Project"
                    disabled={projects.length <= 1}
                  >
                    &#8592;
                  </button>
                  <div style={{
                    background: "#fff",
                    borderRadius: 12,
                    width: 320,
                    height: 320,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    maxWidth: "100vw",
                  }}>
                    <img
                      src={projects[current]?.imageUrl}
                      alt={projects[current]?.projectTitle}
                      style={{
                        width: "90%",
                        height: "90%",
                        objectFit: "contain",
                        borderRadius: 12,
                        background: "#fff",
                        maxWidth: "100%",
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/300?text=Image+Not+Found";
                      }}
                    />
                  </div>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "2.2rem",
                      color: "#1a6ed8",
                      cursor: "pointer",
                      padding: "0 18px",
                      userSelect: "none",
                      lineHeight: 1,
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={handleNext}
                    aria-label="Next Project"
                    disabled={projects.length <= 1}
                  >
                    &#8594;
                  </button>
                </div>
                {/* Dots */}
                <div style={{
                  display: "flex",
                  gap: 8,
                  justifyContent: "center",
                  marginTop: 18,
                }}>
                  {projects.map((_, idx) => (
                    <span
                      key={idx}
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: idx === current ? "#1a6ed8" : "#cbd5e1",
                        display: "inline-block",
                        transition: "background 0.2s",
                        cursor: "pointer",
                      }}
                      onClick={() => setCurrent(idx)}
                    ></span>
                  ))}
                </div>
              </>
            )}
          </div>
          
          {/* Project Description */}
          <div style={{
            flex: 1,
            background: "#ededed",
            borderRadius: 10,
            padding: 24,
            minHeight: 420,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}>
            {loading ? (
              <div>Loading project details...</div>
            ) : projects.length === 0 ? (
              <div>No project details available.</div>
            ) : (
              <>
                <div style={{ fontWeight: 700, fontSize: "1.18rem", color: "#222", marginBottom: 10 }}>
                  {projects[current]?.projectTitle}
                </div>
                <div style={{ color: "#444", fontSize: "1.04rem", marginBottom: 18 }}>
                  {projects[current]?.description}
                </div>
                
                <div style={{ marginTop: "auto", display: "flex", gap: 12 }}>
                  {/* Delete button - only shown to the project owner */}
                  {isOwnProfile && (
                    <button
                      onClick={() => handleDeleteProject(projects[current].id)}
                      style={{
                        background: "#dc3545",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "8px 22px",
                        fontWeight: 600,
                        fontSize: "1rem",
                        cursor: "pointer",
                        textDecoration: "none",
                        boxShadow: "0 2px 8px rgba(220,53,69,0.10)",
                        transition: "background 0.2s"
                      }}
                    >
                      Delete Project
                    </button>
                  )}
                  
                  {/* External link if available */}
                  {projects[current]?.externalLink && (
                    <a
                      href={projects[current].externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: "#1a6ed8",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "8px 22px",
                        fontWeight: 600,
                        fontSize: "1rem",
                        cursor: "pointer",
                        textDecoration: "none",
                        boxShadow: "0 2px 8px rgba(26,110,216,0.10)",
                        transition: "background 0.2s"
                      }}
                    >
                      View Project
                    </a>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
}

export default Portfolio;