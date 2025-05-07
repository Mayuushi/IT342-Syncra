import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NavBar } from "../NavBar";
import "./Job.css";

// You may want to import jobsData from a shared file in a real app
const jobsData = [
  {
    id: 1,
    company: "Amazon",
    title: "Senior UI/UX Designer",
    date: "27 March, 2025",
    tags: ["Full time", "Senior level", "Distant", "Project Work"],
    rate: "$250/hr",
    description: "Lead UI/UX design for Amazon's new platform. Collaborate with product and engineering teams.",
  },
  {
    id: 2,
    company: "Google",
    title: "Junior UI/UX Designer",
    date: "27 March, 2025",
    tags: ["Full time", "Junior level", "Distant", "Project Work", "Part time"],
    rate: "$150/hr",
    description: "Assist in designing Google products. Work with senior designers and learn best practices.",
  },
  {
    id: 3,
    company: "Dribbble",
    title: "Senior Motion Designer",
    date: "27 March, 2025",
    tags: ["Part time", "Senior level", "Full Day", "Shift Work"],
    rate: "$260/hr",
    description: "Create motion graphics for Dribbble's marketing and product videos.",
  },
  {
    id: 4,
    company: "Twitter",
    title: "UX Designer",
    date: "27 March, 2025",
    tags: ["Part time", "Part time", "Project Work"],
    rate: "$120/hr",
    description: "Improve user experience for Twitter's mobile app.",
  },
  {
    id: 5,
    company: "Airbnb",
    title: "Graphic Designer",
    date: "27 March, 2025",
    tags: ["Part time", "Part time"],
    rate: "$300/hr",
    description: "Design graphics for Airbnb's web and print campaigns.",
  },
  {
    id: 6,
    company: "Apple",
    title: "Graphic Designer",
    date: "27 March, 2025",
    tags: ["Part time", "Part time"],
    rate: "$140/hr",
    description: "Work on Apple's branding and marketing materials.",
  },
];

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = jobsData.find((j) => j.id === Number(id));
  const [resume, setResume] = useState(null);
  const [applied, setApplied] = useState(false);

  if (!job) {
    return (
      <>
        <NavBar />
        <div style={{ paddingTop: 80, textAlign: "center" }}>Job not found.</div>
      </>
    );
  }

  const handleResumeChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleApply = (e) => {
    e.preventDefault();
    setApplied(true);
    // Submit logic here
  };

  return (
    <>
      <NavBar />
      <div
        className="job-details-root"
        style={{
          padding: "32px 16px 32px 16px",
          maxWidth: 520,
          margin: "48px auto 32px auto",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          width: "100%",
          minHeight: "calc(100vh - 80px)",
          position: "relative",
          top: 0,
          boxSizing: "border-box",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            marginBottom: 18,
            background: "none",
            border: "none",
            color: "#1a6ed8",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 16,
            padding: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 22, marginRight: 6 }}>&larr;</span> Back
        </button>
        <h2 style={{ marginBottom: 10, fontWeight: 700, fontSize: "1.5rem" }}>{job.title}</h2>
        <div style={{ color: "#888", marginBottom: 10, fontSize: "1.05rem" }}>
          <span style={{ fontWeight: 600 }}>{job.company}</span> &middot; {job.date}
        </div>
        <div style={{ marginBottom: 14, flexWrap: "wrap" }}>
          {job.tags.map((tag, idx) => (
            <span
              key={idx}
              style={{
                background: "#e3e9f7",
                color: "#1a6ed8",
                borderRadius: 8,
                padding: "4px 12px",
                marginRight: 8,
                fontSize: 13,
                fontWeight: 500,
                display: "inline-block",
                marginBottom: 4,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <div style={{ marginBottom: 18, color: "#444", fontSize: "1.08rem", lineHeight: 1.6 }}>
          {job.description || "No description provided."}
        </div>
        <div style={{ fontWeight: 600, marginBottom: 28, fontSize: "1.1rem" }}>
          Rate: <span style={{ color: "#1a6ed8" }}>{job.rate}</span>
        </div>
        {!applied ? (
          <form onSubmit={handleApply} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <label style={{ fontWeight: 500, marginBottom: 4 }}>
              Upload Resume:
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
                required
                style={{
                  marginLeft: 8,
                  marginTop: 8,
                  border: "1px solid #cbd5e1",
                  borderRadius: 6,
                  padding: "6px 8px",
                  fontSize: 15,
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
            </label>
            <button
              type="submit"
              style={{
                background: "#1a6ed8",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "10px 0",
                fontWeight: 700,
                fontSize: "1.08rem",
                cursor: "pointer",
                marginTop: 8,
                transition: "background 0.2s",
              }}
            >
              Apply
            </button>
          </form>
        ) : (
          <div
            style={{
              color: "#1a6ed8",
              fontWeight: 700,
              marginTop: 24,
              fontSize: "1.1rem",
              textAlign: "center",
            }}
          >
            Application sent! Thank you.
          </div>
        )}
      </div>
    </>
  );
}

export default JobDetails;