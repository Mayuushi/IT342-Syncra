import React, { useState } from "react";
import {NavBar} from "../NavBar"; // Add this import

const initialProfile = {
  firstName: "",
  lastName: "",
  password: "",
  confirmPassword: "",
  email: "",
  confirmEmail: "",
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

  // Enhanced styles
  // Add a constant for NavBar height
  const NAVBAR_HEIGHT = 64; // Adjust if your NavBar is taller

  const containerStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "2.5rem",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: `${NAVBAR_HEIGHT + 40}px 0 2.5rem 0`, // Top padding for NavBar + extra space
    background: "#f5f5f5",
    minHeight: "100vh",
  };

  const cardStyle = {
    background: "#fff",
    borderRadius: "18px",
    boxShadow: "0 6px 24px rgba(21,101,192,0.10)",
    padding: "2.5rem 1.5rem 2rem 1.5rem",
    width: "350px",
    minWidth: "280px",
    maxWidth: "100vw",
    position: "relative",
    overflow: "visible",
  };

  const editPanelStyle = {
    background: "#fff",
    borderRadius: "18px",
    boxShadow: "0 6px 24px rgba(21,101,192,0.10)",
    padding: "2.5rem",
    flex: "1 1 420px",
    minWidth: "320px",
    maxWidth: "700px",
  };

  const profileImageWrapper = {
    position: "absolute",
    left: "50%",
    top: "60px",
    transform: "translate(-50%, 0)",
    borderRadius: "50%",
    border: "5px solid #fff",
    width: "110px",
    height: "110px",
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 2px 12px rgba(21,101,192,0.10)",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const profileImageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "50%",
  };

  const uploadBtnStyle = {
    position: "absolute",
    right: 0,
    bottom: 0,
    background: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.3rem",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(21,101,192,0.15)",
    transition: "background 0.2s",
  };

  const cardContentStyle = {
    marginTop: "80px",
    textAlign: "center",
  };

  const nameStyle = {
    fontWeight: "bold",
    fontSize: "1.35rem",
    margin: 0,
    letterSpacing: "0.5px",
  };

  const usernameStyle = {
    color: "#888",
    fontSize: "1.05rem",
    marginBottom: "1.7rem",
    letterSpacing: "0.2px",
  };

  const mainUploadBtnStyle = {
    ...buttonStyle,
    width: "100%",
    margin: "0 auto",
    marginTop: "0.7rem",
    boxShadow: "0 2px 8px rgba(21,101,192,0.08)",
  };

  const tabBtnStyle = (active) => ({
    flex: 1,
    padding: "0.8rem 0",
    border: "none",
    borderBottom: active ? "4px solid #1565c0" : "none",
    background: active ? "#e3f0fc" : "none",
    color: active ? "#1565c0" : "#222",
    fontWeight: active ? "bold" : "normal",
    fontSize: "1.05rem",
    cursor: "pointer",
    outline: "none",
    borderRadius: active ? "8px 8px 0 0" : "8px 8px 0 0",
    marginRight: "0.2rem",
    transition: "all 0.2s",
  });

  const modalOverlay = {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(21,101,192,0.10)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const modalBox = {
    background: "#fff",
    borderRadius: "16px",
    padding: "2.5rem 2rem",
    minWidth: "320px",
    maxWidth: "90vw",
    boxShadow: "0 8px 32px rgba(21,101,192,0.18)",
    textAlign: "center",
    position: "relative",
  };

  // Tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "PROFILE":
        return (
          <form className="profile-form" style={{ display: "flex", flexWrap: "wrap", gap: "1.2rem", width: "100%", justifyContent: "center" }}>
            <div style={{ flex: "1 1 180px", minWidth: 180 }}>
              <label style={{ fontWeight: 500, fontSize: "0.98rem", color: "#1976d2" }}>FIRST NAME</label>
              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: "1 1 180px", minWidth: 180 }}>
              <label style={{ fontWeight: 500, fontSize: "0.98rem", color: "#1976d2" }}>LAST NAME</label>
              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: "1 1 180px", minWidth: 180 }}>
              <label style={{ fontWeight: 500, fontSize: "0.98rem", color: "#1976d2" }}>PASSWORD</label>
              <input
                type="password"
                name="password"
                value={profile.password}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: "1 1 180px", minWidth: 180 }}>
              <label style={{ fontWeight: 500, fontSize: "0.98rem", color: "#1976d2" }}>CONFIRM PASSWORD</label>
              <input
                type="password"
                name="confirmPassword"
                value={profile.confirmPassword}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: "1 1 180px", minWidth: 180 }}>
              <label style={{ fontWeight: 500, fontSize: "0.98rem", color: "#1976d2" }}>EMAIL ADDRESS</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: "1 1 180px", minWidth: 180 }}>
              <label style={{ fontWeight: 500, fontSize: "0.98rem", color: "#1976d2" }}>CONFIRM EMAIL ADDRESS</label>
              <input
                type="email"
                name="confirmEmail"
                value={profile.confirmEmail}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>
            <div style={{ width: "100%", marginTop: "1.7rem", display: "flex", justifyContent: "center" }}>
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
    <>
      <NavBar /> {/* Add NavBar at the top */}
      <div style={containerStyle}>
        {/* Profile Card */}
        <div style={cardStyle}>
          <div style={{ position: "relative" }}>
            <img
              src={backgroundImage}
              alt="background"
              style={{
                width: "100%",
                height: "110px",
                objectFit: "cover",
                borderRadius: "18px 18px 0 0",
                boxShadow: "0 2px 8px rgba(21,101,192,0.06)",
              }}
            />
            <button
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                background: "#222",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontSize: "0.85rem",
                padding: "0.35rem 0.9rem",
                cursor: "pointer",
                opacity: 0.88,
                boxShadow: "0 1px 4px rgba(21,101,192,0.10)",
                transition: "background 0.2s",
              }}
            >
              CHANGE BACKGROUND
            </button>
            <div style={profileImageWrapper}>
              <img
                src={profileImage}
                alt="profile"
                style={profileImageStyle}
              />
              <button
                onClick={() => setShowUploadModal(true)}
                style={uploadBtnStyle}
                title="Upload new photo"
              >
                <span role="img" aria-label="upload">⬆️</span>
              </button>
            </div>
          </div>
          <div style={cardContentStyle}>
            <h2 style={nameStyle}>
              SHANE ADRIAN OPINION
            </h2>
            <div style={usernameStyle}>
              @opinion
            </div>
            <button
              style={mainUploadBtnStyle}
              onClick={() => setShowUploadModal(true)}
            >
              UPLOAD NEW PHOTO
            </button>
          </div>
        </div>

        {/* Edit Profile Panel */}
        <div style={editPanelStyle}>
          <h2 style={{ fontWeight: "bold", fontSize: "1.35rem", marginBottom: "1.7rem", letterSpacing: "0.5px" }}>
            Edit Profile
          </h2>
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "2px solid #e0e0e0", marginBottom: "1.7rem" }}>
            {["PROFILE", "ABOUT", "EXPERIENCE", "EDUCATION"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                style={tabBtnStyle(activeTab === tab)}
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
              <h3 style={{ fontWeight: "bold", marginBottom: "1.7rem", fontSize: "1.15rem" }}>ADD FILES</h3>
              <div
                style={{
                  border: "2px solid #1976d2",
                  borderRadius: "12px",
                  padding: "2.2rem 1.2rem",
                  marginBottom: "1.7rem",
                  background: "#f8fafd",
                  boxShadow: "0 2px 8px rgba(21,101,192,0.08)",
                }}
              >
                <div style={{ fontSize: "3.2rem", color: "#1976d2", marginBottom: "1.1rem" }}>
                  <span role="img" aria-label="upload">☁️</span>
                </div>
                <div style={{ fontWeight: "bold", fontSize: "1.22rem", marginBottom: "0.6rem" }}>
                  UPLOAD YOUR FILES HERE
                </div>
                <div style={{ color: "#888", fontSize: "1.01rem", marginBottom: "1.1rem" }}>
                  FILE SUPPORTED: PNG, JPEG
                </div>
                <div>
                  <label
                    htmlFor="profile-upload"
                    style={{
                      display: "inline-block",
                      border: "2px solid #1976d2",
                      borderRadius: "24px",
                      padding: "0.6rem 2.7rem",
                      color: "#1976d2",
                      fontWeight: "bold",
                      cursor: "pointer",
                      marginBottom: "1.1rem",
                      fontSize: "1.05rem",
                      transition: "background 0.2s, color 0.2s",
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
    </>
  );
}

// Styles for inputs and buttons
const inputStyle = {
  width: "100%",
  padding: "0.8rem",
  borderRadius: "8px",
  border: "1.5px solid #b0b0b0",
  fontSize: "1.02rem",
  marginTop: "0.3rem",
  marginBottom: "0.3rem",
  outline: "none",
  background: "#f9fafd",
  transition: "border 0.2s",
};

const buttonStyle = {
  background: "#1976d2",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "0.8rem 2.5rem",
  fontWeight: "bold",
  fontSize: "1.08rem",
  cursor: "pointer",
  transition: "background 0.2s",
  letterSpacing: "0.5px",
  boxShadow: "0 2px 8px rgba(21,101,192,0.08)",
};

export default Profile;