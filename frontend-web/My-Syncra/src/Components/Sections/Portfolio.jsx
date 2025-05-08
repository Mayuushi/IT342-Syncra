import React, { useState } from "react";
import { NavBar } from "../NavBar";
import spacexImg from "../../assets/spacex.jpg";
import teslaImg from "../../assets/Tesla.jpg";
import xImg from "../../assets/x.png";
import "./Portfolio.css";

const projects = [
  {
    title: "Tesla",
    image: teslaImg,
    description:
      "The Tesla website (tesla.com) is a sleek, user-friendly platform showcasing electric vehicles, energy products, and innovations, featuring an intuitive car configurator, online ordering, and real-time updates on Tesla’s technology and sustainability efforts.",
    link: "https://www.tesla.com/",
  },
  {
    title: "X",
    image: xImg,
    description:
      "The X website (x.com) is a real-time social platform for sharing updates, engaging in conversations, and following trending topics. Features a minimalist design, personalized feeds, multimedia sharing, and premium options.",
    link: "https://x.com/",
  },
  {
    title: "SpaceX",
    image: spacexImg,
    description:
      "The SpaceX website (spacex.com) is a futuristic platform featuring high-quality visuals, live mission updates, and detailed pages on rockets, spaceflight, and Starlink. Highlights achievements, careers, and real-time launch coverage.",
    link: "https://www.spacex.com/",
  },
];

function Portfolio() {
  const [current, setCurrent] = useState(0);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <NavBar />
      <div
        style={{
          background: "#f7f9fb",
          minHeight: "100vh",
          width: "100vw",
          paddingTop: 64,
          overflowX: "auto", // Prevent horizontal overflow
          boxSizing: "border-box",
        }}
      >
        {/* Cover Banner - Default Color */}
        <div
          style={{
            width: "100%",
            minWidth: 0,
            height: 180,
            background: "#e5e7eb",
            position: "relative",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          {/* Edit Profile Button */}
          <button
            style={{
              position: "absolute",
              top: 20,
              right: 40,
              background: "#fff",
              color: "#222",
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: "8px 18px",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(26,110,216,0.10)",
              zIndex: 2,
            }}
          >
            EDIT PROFILE
          </button>
        </div>

        {/* Profile Card */}
        <div
          style={{
            width: "100%",
            maxWidth: 1100,
            margin: "0 auto",
            marginTop: -60,
            marginBottom: 32,
            background: "#fff",
            borderRadius: 10,
            boxShadow: "0 4px 24px rgba(26,110,216,0.10)",
            padding: "32px 16px 24px 16px", // Responsive padding
            display: "flex",
            alignItems: "center",
            position: "relative",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <div style={{
            position: "relative",
            marginRight: 32,
            marginLeft: 12,
          }}>
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
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
            />
            <div style={{ width: 110, height: 40 }}></div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: "1.25rem", fontWeight: 700, marginRight: 10 }}>Shane Adrian Opinion</span>
              <svg width="16" height="16" fill="#1a6ed8" style={{ marginRight: 4, verticalAlign: "middle" }} viewBox="0 0 20 20"><path d="M10 2C6.13 2 3 5.13 3 9c0 5.25 7 9 7 9s7-3.75 7-9c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 10 6a2.5 2.5 0 0 1 0 5.5z"/></svg>
              <span style={{ color: "#1a6ed8", fontSize: "1rem" }}>City, country</span>
            </div>
            <div style={{ color: "#888", fontSize: "1rem", marginBottom: 8 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dapibus eros eu vehicula interdum. Cras nec ultricies massa.
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
              <button style={{
                background: "#fff",
                color: "#1a6ed8",
                border: "1.5px solid #1a6ed8",
                borderRadius: 6,
                padding: "7px 18px",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
              }}>1,043 CONNECTIONS</button>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div
          style={{
            width: "100%",
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            alignItems: "flex-start",
            marginBottom: 48,
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          {/* Carousel */}
          <div
            style={{
              flex: 2,
              minWidth: 320,
              background: "#fff",
              borderRadius: 10,
              boxShadow: "0 4px 24px rgba(26,110,216,0.10)",
              padding: "32px 8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minHeight: 420,
              position: "relative",
              boxSizing: "border-box",
              overflow: "hidden",
              width: "100%",
              maxWidth: 600,
            }}
          >
            <div style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: 18, alignSelf: "flex-start" }}>Projects</div>
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
                  src={projects[current].image}
                  alt={projects[current].title}
                  style={{
                    width: "90%",
                    height: "90%",
                    objectFit: "contain",
                    borderRadius: 12,
                    background: "#fff",
                    maxWidth: "100%",
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
                  }}
                ></span>
              ))}
            </div>
          </div>
          {/* Project Description */}
          <div
            style={{
              flex: 1,
              minWidth: 220,
              background: "#ededed",
              borderRadius: 10,
              padding: 16,
              minHeight: 420,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              boxSizing: "border-box",
              overflow: "hidden",
              width: "100%",
              maxWidth: 400,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: "1.18rem", color: "#222", marginBottom: 10 }}>
              {projects[current].title}
            </div>
            <div style={{ color: "#444", fontSize: "1.04rem", marginBottom: 18 }}>
              {projects[current].description}
            </div>
            <a
              href={projects[current].link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginTop: "auto",
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
          </div>
        </div>

        {/* Footer */}
        <footer
          style={{
            width: "100%",
            background: "#f4f4f4",
            padding: "32px 0 16px 0",
            borderTop: "1px solid #e0e0e0",
            marginTop: 32,
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 1100,
              margin: "0 auto",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "flex-start",
              fontSize: 14,
              color: "#444",
              boxSizing: "border-box",
              paddingLeft: 16,
              paddingRight: 16,
              overflow: "hidden",
            }}
          >
            <div style={{ flex: 2, minWidth: 200, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Navigation</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
                <span>About</span>
                <span>Careers</span>
                <span>Advertising</span>
                <span>Small Business</span>
                <span>Talent Solutions</span>
                <span>Marketing Solutions</span>
                <span>Sales Solutions</span>
                <span>Safety Center</span>
                <span>Community Guidelines</span>
                <span>Privacy & Terms</span>
                <span>Mobile App</span>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 180, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Fast access</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button style={{
                  background: "#1a6ed8",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 14px",
                  fontWeight: 600,
                  fontSize: "1rem",
                  cursor: "pointer",
                  marginBottom: 4,
                }}>QUESTIONS?</button>
                <button style={{
                  background: "#fff",
                  color: "#1a6ed8",
                  border: "1.5px solid #1a6ed8",
                  borderRadius: 6,
                  padding: "6px 14px",
                  fontWeight: 600,
                  fontSize: "1rem",
                  cursor: "pointer",
                }}>SETTINGS</button>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 120 }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Language</div>
              <select style={{
                width: "100%",
                padding: "6px 8px",
                borderRadius: 6,
                border: "1px solid #ccc",
                fontSize: "1rem",
              }}>
                <option>ENGLISH</option>
                <option>FILIPINO</option>
                <option>日本語</option>
              </select>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Portfolio;