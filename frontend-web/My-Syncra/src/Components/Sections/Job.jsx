import React, { useState } from "react";
import {NavBar} from "../NavBar";
import "./Portfolio.css";

const jobsData = [
  {
    id: 1,
    company: "Amazon",
    title: "Senior UI/UX Designer",
    date: "27 March, 2025",
    tags: ["Full time", "Senior level", "Distant", "Project Work"],
    rate: "$250/hr",
  },
  {
    id: 2,
    company: "Google",
    title: "Junior UI/UX Designer",
    date: "27 March, 2025",
    tags: ["Full time", "Junior level", "Distant", "Project Work", "Part time"],
    rate: "$150/hr",
  },
  {
    id: 3,
    company: "Dribbble",
    title: "Senior Motion Designer",
    date: "27 March, 2025",
    tags: ["Part time", "Senior level", "Full Day", "Shift Work"],
    rate: "$260/hr",
  },
  {
    id: 4,
    company: "Twitter",
    title: "UX Designer",
    date: "27 March, 2025",
    tags: ["Part time", "Part time", "Project Work"],
    rate: "$120/hr",
  },
  {
    id: 5,
    company: "Airbnb",
    title: "Graphic Designer",
    date: "27 March, 2025",
    tags: ["Part time", "Part time"],
    rate: "$300/hr",
  },
  {
    id: 6,
    company: "Apple",
    title: "Graphic Designer",
    date: "27 March, 2025",
    tags: ["Part time", "Part time"],
    rate: "$140/hr",
  },
];

const workingScheduleOptions = [
  "Full time",
  "Part time",
  "Internship",
  "Project Work",
  "Volunteering",
];

const employmentTypeOptions = [
  "Full day",
  "Flexible Schedule",
  "Shift Work",
  "Distant Work",
  "Shift Method",
];

function Portfolio() {
  const [selectedWorking, setSelectedWorking] = useState([]);
  const [selectedEmployment, setSelectedEmployment] = useState([]);

  const handleWorkingChange = (option) => {
    setSelectedWorking((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const handleEmploymentChange = (option) => {
    setSelectedEmployment((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  // Filter jobs based on selected filters
  const filteredJobs = jobsData.filter((job) => {
    const workingMatch =
      selectedWorking.length === 0 ||
      selectedWorking.some((w) => job.tags.includes(w));
    const employmentMatch =
      selectedEmployment.length === 0 ||
      selectedEmployment.some((e) => job.tags.includes(e));
    return workingMatch && employmentMatch;
  });

  return (
    <>
      <NavBar />
      <div className="portfolio-root">
        <aside className="portfolio-sidebar">
          <div className="portfolio-promo">
            <div className="portfolio-promo-content">
              <h2>Get your<br />Best profession<br />with Syncra</h2>
              <button>VIEW ALL</button>
            </div>
          </div>
          <div className="portfolio-filters">
            <h3>FILTERS</h3>
            <div className="portfolio-filter-group">
              <div className="portfolio-filter-title">Working Schedule</div>
              {workingScheduleOptions.map((option) => (
                <label key={option} className="portfolio-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedWorking.includes(option)}
                    onChange={() => handleWorkingChange(option)}
                  />
                  {option}
                </label>
              ))}
            </div>
            <div className="portfolio-filter-group">
              <div className="portfolio-filter-title">Employment type</div>
              {employmentTypeOptions.map((option) => (
                <label key={option} className="portfolio-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedEmployment.includes(option)}
                    onChange={() => handleEmploymentChange(option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        </aside>
        <main className="portfolio-main">
          <div className="portfolio-header">
            <h1>Recommended Jobs <span className="portfolio-count">{filteredJobs.length}</span></h1>
            <div className="portfolio-sort">
              sort by: <a href="#" className="portfolio-sort-link">Last Update</a>
            </div>
          </div>
          <div className="portfolio-grid">
            {filteredJobs.map((job) => (
              <div className="portfolio-card" key={job.id}>
                <div className="portfolio-card-date">{job.date}</div>
                <div className="portfolio-card-company">{job.company}</div>
                <div className="portfolio-card-title">{job.title}</div>
                <div className="portfolio-card-tags">
                  {job.tags.map((tag, idx) => (
                    <span className="portfolio-tag" key={idx}>{tag}</span>
                  ))}
                </div>
                <div className="portfolio-card-bottom">
                  <span className="portfolio-card-rate">{job.rate}</span>
                  <button className="portfolio-card-details">Details</button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

export default Portfolio;