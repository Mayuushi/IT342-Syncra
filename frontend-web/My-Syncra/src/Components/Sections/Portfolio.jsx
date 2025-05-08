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
    link: "https://www.tesla.com/",
  },
  {
    title: "X",
    image: xImg,
    description:
      "A real-time social platform for sharing updates, engaging in conversations, and following trending topics. Features a minimalist design, personalized feeds, multimedia sharing, and premium options.",
    link: "https://x.com/",
  },
  {
    title: "SpaceX",
    image: spacexImg,
    description:
      "A futuristic platform featuring high-quality visuals, live mission updates, and detailed pages on rockets, spaceflight, and Starlink. Highlights achievements, careers, and real-time launch coverage.",
    link: "https://www.spacex.com/",
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "#f7f9fb",
          paddingTop: 64,
          boxSizing: "border-box",
        }}
      >
        {/* Profile Section */}
        <section
          style={{
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 4px 24px rgba(26,110,216,0.10)",
            padding: "36px 32px 28px 32px",
            marginTop: 40,
            marginBottom: 36,
            width: "100%",
            maxWidth: 520,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="Profile"
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              border: "4px solid #e3e9f7",
              objectFit: "cover",
              background: "#e3e9f7",
              boxShadow: "0 2px 12px rgba(26,110,216,0.10)",
              marginBottom: 18,
            }}
          />
          <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 6, color: "#1a6ed8" }}>
            Shane Adrian Opinion
          </h1>
          <div style={{ fontSize: "1.1rem", color: "#888", marginBottom: 10 }}>
            Frontend Web Developer &bull; City, Country
          </div>
          <div style={{ fontSize: "1.08rem", color: "#444", marginBottom: 18, textAlign: "center", maxWidth: 420 }}>
            Passionate web developer with a knack for building beautiful, functional user interfaces and seamless user experiences. Always eager to learn and take on new challenges.
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <a
              href="mailto:your.email@example.com"
              style={{
                background: "#1a6ed8",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "10px 28px",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
                textDecoration: "none",
                boxShadow: "0 2px 8px rgba(26,110,216,0.10)",
                transition: "background 0.2s"
              }}
            >
              Contact
            </a>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#fff",
                color: "#1a6ed8",
                border: "2px solid #1a6ed8",
                borderRadius: 8,
                padding: "10px 28px",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
                textDecoration: "none",
                boxShadow: "0 2px 8px rgba(26,110,216,0.06)",
                transition: "background 0.2s"
              }}
            >
              LinkedIn
            </a>
          </div>
        </section>

        {/* Projects Section */}
        <section
          style={{
            width: "100%",
            maxWidth: 1100,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2 style={{
            fontSize: "1.7rem",
            fontWeight: 700,
            color: "#1a6ed8",
            marginBottom: 24,
            letterSpacing: 1,
          }}>
            My Projects
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 32,
              width: "100%",
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
                <div style={{ color: "#444", fontSize: "1.04rem", textAlign: "center", marginBottom: 18 }}>
                  {project.description}
                </div>
                <a
                  href={project.link}
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
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default Portfolio;