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
      <div className="portfolio-profile-root">
        <div className="portfolio-profile-header">
          <div className="portfolio-profile-banner">
            <img
              src={spacexImg}
              alt="Banner"
              className="portfolio-profile-banner-img"
            />
          </div>
          <div className="portfolio-profile-info">
            <div className="portfolio-profile-avatar">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Profile"
                className="portfolio-profile-avatar-img"
              />
            </div>
            <div className="portfolio-profile-details">
              <div className="portfolio-profile-name">Shane Adrian Opinion</div>
              <div className="portfolio-profile-location">
                <svg width="16" height="16" fill="#1a6ed8" style={{marginRight: 4, verticalAlign: "middle"}} viewBox="0 0 20 20"><path d="M10 2C6.13 2 3 5.13 3 9c0 5.25 7 9 7 9s7-3.75 7-9c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 10 6a2.5 2.5 0 0 1 0 5.5z"/></svg>
                City, country
              </div>
              <div className="portfolio-profile-bio">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dapibus eros eu vehicula interdum. Cras nec ultricies massa.
              </div>
              <div className="portfolio-profile-actions">
                <button className="portfolio-profile-btn">CONTACT INFO</button>
                <button className="portfolio-profile-btn outline">1,043 CONNECTIONS</button>
              </div>
            </div>
            <div className="portfolio-profile-edit">
              <button className="portfolio-profile-edit-btn">EDIT PROFILE</button>
            </div>
          </div>
        </div>

        <div className="portfolio-projects-section">
          <div className="portfolio-projects-carousel">
            <div className="portfolio-projects-title">Projects</div>
            <div className="portfolio-carousel-content">
              <button
                className="portfolio-carousel-arrow left"
                onClick={handlePrev}
                aria-label="Previous Project"
              >
                &#8592;
              </button>
              <div className="portfolio-carousel-image-wrapper">
                <img
                  src={projects[current].image}
                  alt={projects[current].title}
                  className="portfolio-carousel-image"
                />
                <div className="portfolio-carousel-dots">
                  {projects.map((_, idx) => (
                    <span
                      key={idx}
                      className={`portfolio-carousel-dot${idx === current ? " active" : ""}`}
                    ></span>
                  ))}
                </div>
              </div>
              <button
                className="portfolio-carousel-arrow right"
                onClick={handleNext}
                aria-label="Next Project"
              >
                &#8594;
              </button>
            </div>
          </div>
          <div className="portfolio-projects-description">
            <div className="portfolio-projects-description-title">
              {projects[current].title}
            </div>
            <div className="portfolio-projects-description-text">
              {projects[current].description}
            </div>
          </div>
        </div>

        <footer className="portfolio-footer">
          <div className="portfolio-footer-links">
            <div>
              <div>Navigation</div>
              <ul>
                <li>About</li>
                <li>Careers</li>
                <li>Advertising</li>
                <li>Small Business</li>
              </ul>
            </div>
            <div>
              <div>Talent Solutions</div>
              <ul>
                <li>Marketing Solutions</li>
                <li>Sales Solutions</li>
                <li>Safety Center</li>
              </ul>
            </div>
            <div>
              <div>Community Guidelines</div>
              <ul>
                <li>Privacy & Terms</li>
                <li>Mobile App</li>
              </ul>
            </div>
          </div>
          <div className="portfolio-footer-actions">
            <div>
              <div>Fast access</div>
              <button className="portfolio-footer-btn">QUESTIONS?</button>
              <button className="portfolio-footer-btn outline">SETTINGS</button>
            </div>
            <div>
              <div>Language</div>
              <select className="portfolio-footer-select">
                <option>ENGLISH</option>
                <option>FILIPINO</option>
              </select>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Portfolio;