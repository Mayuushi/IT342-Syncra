import React, { useState } from "react";

const initialProfile = {
  firstName: "WALTER",
  lastName: "SHENENCIA",
  password: "********",
  confirmPassword: "********",
  email: "shaneopinion@gmail.com",
  confirmEmail: "shaneopinion@gmail.com",
};

function Profile() {
  const [activeTab, setActiveTab] = useState("PROFILE");
  const [profile, setProfile] = useState(initialProfile);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [profileImage, setProfileImage] = useState(
    "https://randomuser.me/api/portraits/men/1.jpg"
  );
  const [backgroundImage, setBackgroundImage] = useState(
    "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=facearea&w=800&q=80"
  );

  // Handle tab switching
  const handleTabClick = (tab) => setActiveTab(tab);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      const reader = new FileReader();
      reader.onload = (ev) => setProfileImage(ev.target.result);
      reader.readAsDataURL(file);
      setShowUploadModal(false);
    }
  };

  // Responsive styles
  const containerStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "2rem",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "2rem 0",
    background: "#f5f5f5",
    minHeight: "100vh",
  };

  const cardStyle = {
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
    padding: "2rem 1.5rem 1.5rem 1.5rem",
    width: "340px",
    minWidth: "280px",
    maxWidth: "100vw",
    position: "relative",
  };

  const editPanelStyle = {
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
    padding: "2rem",
    flex: "1 1 400px",
    minWidth: "320px",
    maxWidth: "700px",
  };

  // Modal styles
  const modalOverlay = {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.2)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const modalBox = {
    background: "#fff",
    borderRadius: "8px",
    padding: "2rem",
    minWidth: "320px",
    maxWidth: "90vw",
    boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
    textAlign: "center",
    position: "relative",
  };

  // Tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "PROFILE":
        return (
          <form className="profile-form" style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ flex: "1 1 180px" }}>
              <label>FIRST NAME</label>
              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: "1 1 180px" }}>
              <label>LAST NAME</label>
              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: "1 1 180px" }}>
              <label>PASSWORD</label>
              <input
                type="password"
                name="password"
                value={profile.password}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: "1 1 180px" }}>
              <label>CONFIRM PASSWORD</label>
              <input
                type="password"
                name="confirmPassword"
                value={profile.confirmPassword}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: "1 1 180px" }}>
              <label>EMAIL ADDRESS</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: "1 1 180px" }}>
              <label>CONFIRM EMAIL ADDRESS</label>
              <input
                type="email"
                name="confirmEmail"
                value={profile.confirmEmail}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>
            <div style={{ width: "100%", marginTop: "1.5rem" }}>
              <button type="button" style={buttonStyle}>
                UPLOAD INFO
              </button>
            </div>
          </form>
        );
      case "ABOUT":
        return (
          <div>
            <textarea
              style={{ ...inputStyle, width: "100%", minHeight: "100px" }}
              placeholder="Write something about yourself..."
            />
            <div style={{ marginTop: "1.5rem" }}>
              <button type="button" style={buttonStyle}>
                SAVE
              </button>
            </div>
          </div>
        );
      case "EXPERIENCE":
        return (
          <div>
            <textarea
              style={{ ...inputStyle, width: "100%", minHeight: "100px" }}
              placeholder="Describe your experience..."
            />
            <div style={{ marginTop: "1.5rem" }}>
              <button type="button" style={buttonStyle}>
                SAVE
              </button>
            </div>
          </div>
        );
      case "EDUCATION":
        return (
          <div>
            <textarea
              style={{ ...inputStyle, width: "100%", minHeight: "100px" }}
              placeholder="Describe your education..."
            />
            <div style={{ marginTop: "1.5rem" }}>
              <button type="button" style={buttonStyle}>
                SAVE
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={containerStyle}>
      {/* Profile Card */}
      <div style={cardStyle}>
        <div style={{ position: "relative" }}>
          <img
            src={backgroundImage}
            alt="background"
            style={{
              width: "100%",
              height: "90px",
              objectFit: "cover",
              borderRadius: "8px 8px 0 0",
            }}
          />
          <button
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "#222",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontSize: "0.8rem",
              padding: "0.3rem 0.7rem",
              cursor: "pointer",
              opacity: 0.85,
            }}
          >
            CHANGE BACKGROUND
          </button>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "65px",
              transform: "translate(-50%, 0)",
              borderRadius: "50%",
              border: "4px solid #fff",
              width: "90px",
              height: "90px",
              overflow: "hidden",
              background: "#fff",
            }}
          >
            <img
              src={profileImage}
              alt="profile"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <button
              onClick={() => setShowUploadModal(true)}
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                background: "#0073b1",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              }}
              title="Upload new photo"
            >
              <span role="img" aria-label="upload">⬆️</span>
            </button>
          </div>
        </div>
        <div style={{ marginTop: "60px", textAlign: "center" }}>
          <h2 style={{ fontWeight: "bold", fontSize: "1.3rem", margin: 0 }}>
            SHANE ADRIAN OPINION
          </h2>
          <div style={{ color: "#888", fontSize: "1rem", marginBottom: "1.5rem" }}>
            @opinion
          </div>
          <button
            style={{
              ...buttonStyle,
              width: "100%",
              margin: "0 auto",
              marginTop: "0.5rem",
            }}
            onClick={() => setShowUploadModal(true)}
          >
            UPLOAD NEW PHOTO
          </button>
        </div>
      </div>

      {/* Edit Profile Panel */}
      <div style={editPanelStyle}>
        <h2 style={{ fontWeight: "bold", fontSize: "1.3rem", marginBottom: "1.5rem" }}>
          Edit Profile
        </h2>
        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "2px solid #e0e0e0", marginBottom: "1.5rem" }}>
          {["PROFILE", "ABOUT", "EXPERIENCE", "EDUCATION"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              style={{
                flex: 1,
                padding: "0.7rem 0",
                border: "none",
                borderBottom: activeTab === tab ? "4px solid #1565c0" : "none",
                background: "none",
                color: activeTab === tab ? "#1565c0" : "#222",
                fontWeight: activeTab === tab ? "bold" : "normal",
                fontSize: "1rem",
                cursor: "pointer",
                outline: "none",
                transition: "border-bottom 0.2s",
              }}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        {/* Tab Content */}
        <div>{renderTabContent()}</div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3 style={{ fontWeight: "bold", marginBottom: "1.5rem" }}>ADD FILES</h3>
            <div
              style={{
                border: "2px solid #1976d2",
                borderRadius: "8px",
                padding: "2rem 1rem",
                marginBottom: "1.5rem",
                background: "#f8fafd",
              }}
            >
              <div style={{ fontSize: "3rem", color: "#1976d2", marginBottom: "1rem" }}>
                <span role="img" aria-label="upload">☁️</span>
              </div>
              <div style={{ fontWeight: "bold", fontSize: "1.2rem", marginBottom: "0.5rem" }}>
                UPLOAD YOUR FILES HERE
              </div>
              <div style={{ color: "#888", fontSize: "0.95rem", marginBottom: "1rem" }}>
                FILE SUPPORTED: PNG, JPEG
              </div>
              <div>
                <label
                  htmlFor="profile-upload"
                  style={{
                    display: "inline-block",
                    border: "2px solid #1976d2",
                    borderRadius: "24px",
                    padding: "0.5rem 2.5rem",
                    color: "#1976d2",
                    fontWeight: "bold",
                    cursor: "pointer",
                    marginBottom: "1rem",
                  }}
                >
                  BROWSE
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/png, image/jpeg"
                    style={{ display: "none" }}
                    onChange={handlePhotoChange}
                  />
                </label>
              </div>
            </div>
            <button
              style={buttonStyle}
              onClick={() => setShowUploadModal(false)}
            >
              SAVE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles for inputs and buttons
const inputStyle = {
  width: "100%",
  padding: "0.7rem",
  borderRadius: "8px",
  border: "1.5px solid #222",
  fontSize: "1rem",
  marginTop: "0.3rem",
  marginBottom: "0.3rem",
  outline: "none",
};

const buttonStyle = {
  background: "#1976d2",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "0.7rem 2.5rem",
  fontWeight: "bold",
  fontSize: "1rem",
  cursor: "pointer",
  transition: "background 0.2s",
};

export default Profile;