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
        <div style={{ padding: 32 }}>Job not found.</div>
      </>
    );
  }

  const handleResumeChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleApply = (e) => {
    e.preventDefault();
    setApplied(true);
    // Here you would send the resume and application to your backend
  };

  return (
    <>
      <NavBar />
      <div className="job-details-root" style={{
        padding: 24,
        maxWidth: 600,
        margin: "32px auto",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        width: "95vw"
      }}>
        <button onClick={() => navigate(-1)} style={{
          marginBottom: 16,
          background: "none",
          border: "none",
          color: "#1a6ed8",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: 16
        }}>&larr; Back</button>
        <h2 style={{ marginBottom: 8 }}>{job.title}</h2>
        <div style={{ color: "#888", marginBottom: 8 }}>{job.company} &middot; {job.date}</div>
        <div style={{ marginBottom: 12, flexWrap: "wrap" }}>
          {job.tags.map((tag, idx) => (
            <span key={idx} style={{
              background: "#e3e9f7",
              color: "#1a6ed8",
              borderRadius: 8,
              padding: "3px 10px",
              marginRight: 6,
              fontSize: 13,
              fontWeight: 500,
              display: "inline-block",
              marginBottom: 4
            }}>{tag}</span>
          ))}
        </div>
        <div style={{ marginBottom: 16, color: "#444" }}>{job.description || "No description provided."}</div>
        <div style={{ fontWeight: 600, marginBottom: 24 }}>Rate: {job.rate}</div>
        {!applied ? (
          <form onSubmit={handleApply} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label>
              Upload Resume:
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeChange} required style={{ marginLeft: 8 }} />
            </label>
            <button type="submit" style={{
              background: "#1a6ed8",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "8px 18px",
              fontWeight: 600,
              cursor: "pointer"
            }}>
              Apply
            </button>
          </form>
        ) : (
          <div style={{ color: "#1a6ed8", fontWeight: 600, marginTop: 16 }}>Application sent! Thank you.</div>
        )}
      </div>
    </>
  );
}

export default JobDetails;