import React from "react";
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
      "A sleek, user-friendly platform showcasing electric vehicles, energy products, and innovations, featuring an intuitive car configurator, online ordering, and real-time updates on Tesla’s technology and sustainability efforts.",
  },
  {
    title: "X",
    image: xImg,
    description:
      "A real-time social platform for sharing updates, engaging in conversations, and following trending topics. Features a minimalist design, personalized feeds, multimedia sharing, and premium options.",
  },
  {
    title: "SpaceX",
    image: spacexImg,
    description:
      "A futuristic platform featuring high-quality visuals, live mission updates, and detailed pages on rockets, spaceflight, and Starlink. Highlights achievements, careers, and real-time launch coverage.",
  },
];

function Portfolio() {
  return (
    <>
      <NavBar />
      <div
        style={{
          minHeight: "100vh",
          width: "100vw",
          background: "linear-gradient(120deg, #1a6ed8 0%, #e3e9f7 100%)",
          paddingTop: 64,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "40px 16px 32px 16px",
            boxSizing: "border-box",
          }}
        >
          {/* Profile Card */}
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              boxShadow: "0 8px 32px rgba(26,110,216,0.13)",
              padding: "36px 32px 28px 32px",
              marginBottom: 40,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Profile"
              style={{
                width: 110,
                height: 110,
                borderRadius: "50%",
                border: "4px solid #e3e9f7",
                objectFit: "cover",
                background: "#e3e9f7",
                boxShadow: "0 2px 12px rgba(26,110,216,0.10)",
                marginBottom: 18,
              }}
            />
            <div style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: 6, color: "#1a6ed8" }}>
              Shane Adrian Opinion
            </div>
            <div style={{ fontSize: "1.05rem", color: "#888", marginBottom: 10 }}>
              City, country
            </div>
            <div style={{ fontSize: "1.08rem", color: "#444", marginBottom: 18, textAlign: "center", maxWidth: 480 }}>
              Passionate web developer with a knack for building beautiful, functional user interfaces and seamless user experiences. Always eager to learn and take on new challenges.
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <button style={{
                background: "#1a6ed8",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "10px 28px",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(26,110,216,0.10)",
                transition: "background 0.2s"
              }}>Contact</button>
              <button style={{
                background: "#fff",
                color: "#1a6ed8",
                border: "2px solid #1a6ed8",
                borderRadius: 8,
                padding: "10px 28px",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(26,110,216,0.06)",
                transition: "background 0.2s"
              }}>Connections</button>
            </div>
          </div>

          {/* Projects Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 32,
              marginBottom: 24,
            }}
          >
            {projects.map((project, idx) => (
              <div
                key={idx}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  boxShadow: "0 4px 24px rgba(26,110,216,0.10)",
                  padding: "24px 20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minHeight: 420,
                  transition: "transform 0.15s",
                  position: "relative",
                }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  style={{
                    width: "90%",
                    height: 180,
                    objectFit: "contain",
                    borderRadius: 12,
                    background: "#f5f6fa",
                    marginBottom: 18,
                    boxShadow: "0 1px 6px rgba(26,110,216,0.06)",
                  }}
                />
                <div style={{ fontWeight: 700, fontSize: "1.18rem", color: "#1a6ed8", marginBottom: 10 }}>
                  {project.title}
                </div>
                <div style={{ color: "#444", fontSize: "1.04rem", textAlign: "center" }}>
                  {project.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Portfolio;