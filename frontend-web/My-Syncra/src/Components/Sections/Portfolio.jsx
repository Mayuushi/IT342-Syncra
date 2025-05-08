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
  },
  {
    title: "X",
    image: xImg,
    description:
      "The X website [x.com] is a sleek, real-time social platform for sharing updates, engaging in conversations, and following trending topics. It features a minimalist design, personalized feeds, multimedia sharing, and premium options like X Premium for enhanced visibility and monetization.",
  },
  {
    title: "SpaceX",
    image: spacexImg,
    description:
      "The SpaceX website [spacex.com] is a sleek, futuristic platform featuring high-quality visuals, live mission updates, and detailed pages on rockets, spaceflight, and Starlink. It highlights SpaceX’s achievements, career opportunities, and an online shop, with smooth navigation and real-time launch coverage.",
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
        className="portfolio-root"
        style={{
          minHeight: "100vh",
          width: "100vw",
          background: "linear-gradient(135deg, #1a6ed8 0%, #e3e9f7 100%)",
          paddingTop: 64,
          overflowX: "hidden",
          boxSizing: "border-box",
        }}
      >
        <div
          className="portfolio-container"
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "32px 12px",
            boxSizing: "border-box",
          }}
        >
          <div
            className="portfolio-profile-card"
            style={{
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 4px 24px rgba(26,110,216,0.10)",
              padding: "32px 24px",
              marginBottom: 32,
              display: "flex",
              alignItems: "center",
              gap: 32,
              flexWrap: "wrap",
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
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            />
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 4 }}>
                Shane Adrian Opinion
              </div>
              <div style={{ fontSize: "1rem", color: "#888", marginBottom: 8 }}>
                <svg width="16" height="16" fill="#1a6ed8" style={{ marginRight: 4, verticalAlign: "middle" }} viewBox="0 0 20 20"><path d="M10 2C6.13 2 3 5.13 3 9c0 5.25 7 9 7 9s7-3.75 7-9c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 10 6a2.5 2.5 0 0 1 0 5.5z"/></svg>
                City, country
              </div>
              <div style={{ fontSize: "1.02rem", color: "#444", marginBottom: 8 }}>
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
            <div>
              <button style={{
                background: "#e3e9f7",
                color: "#1a6ed8",
                border: "none",
                borderRadius: 6,
                padding: "7px 18px",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
                marginTop: 8,
              }}>EDIT PROFILE</button>
            </div>
          </div>

          <div
            className="portfolio-projects-section"
            style={{
              display: "flex",
              gap: 32,
              alignItems: "flex-start",
              flexWrap: "wrap",
              marginBottom: 32,
            }}
          >
            <div
              className="portfolio-projects-carousel"
              style={{
                background: "#fff",
                borderRadius: 18,
                flex: 2,
                padding: "28px 0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: 0,
                boxShadow: "0 4px 24px rgba(26,110,216,0.10)",
                maxWidth: "100%",
              }}
            >
              <div style={{ fontSize: "1.15rem", fontWeight: 600, marginBottom: 16, alignSelf: "flex-start", marginLeft: 32 }}>
                Projects
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "2.4rem",
                    color: "#1a6ed8",
                    cursor: "pointer",
                    padding: "0 18px",
                    transition: "color 0.2s",
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
                <div
                  style={{
                    position: "relative",
                    background: "#f5f6fa",
                    borderRadius: 12,
                    width: 370,
                    height: 320,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    maxWidth: "100vw",
                  }}
                >
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
                  <div style={{
                    position: "absolute",
                    bottom: 14,
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: 8,
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
                <button
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "2.4rem",
                    color: "#1a6ed8",
                    cursor: "pointer",
                    padding: "0 18px",
                    transition: "color 0.2s",
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
            </div>
            <div
              className="portfolio-projects-description"
              style={{
                background: "#f2f3f5",
                borderRadius: 18,
                flex: 1,
                padding: 22,
                minWidth: 220,
                maxWidth: 370,
                marginTop: 0,
                marginLeft: 0,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                boxSizing: "border-box",
                maxWidth: "100vw",
              }}
            >
              <div style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: 10 }}>
                {projects[current].title}
              </div>
              <div style={{ fontSize: "1.02rem", color: "#444", lineHeight: 1.5 }}>
                {projects[current].description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Portfolio;