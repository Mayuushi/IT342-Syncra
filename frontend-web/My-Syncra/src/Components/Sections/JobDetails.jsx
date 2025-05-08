import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../NavBar";
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
    description: "Lead UI/UX design for Amazon's new platform. Collaborate with product and engineering teams. You will be responsible for designing intuitive user interfaces, conducting user research, and working closely with cross-functional teams to deliver high-quality products. The ideal candidate has a strong portfolio, excellent communication skills, and a passion for innovation. You will also mentor junior designers and contribute to the overall design strategy. This is a unique opportunity to shape the future of e-commerce at a global scale.",
  },
  {
    id: 2,
    company: "Google",
    title: "Junior UI/UX Designer",
    date: "27 March, 2025",
    tags: ["Full time", "Junior level", "Distant", "Project Work", "Part time"],
    rate: "$150/hr",
    description: "Assist in designing Google products. Work with senior designers and learn best practices. Participate in brainstorming sessions, create wireframes and prototypes, and help conduct usability testing. This role is perfect for someone eager to grow their skills in a fast-paced, innovative environment. You'll have the chance to work on products used by millions worldwide.",
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
          padding: "40px 28px 40px 28px",
          maxWidth: 820,
          margin: "56px auto 32px auto",
          background: "linear-gradient(135deg, #1a6ed8 0%, #e3e9f7 100%)",
          borderRadius: 22,
          boxShadow: "0 6px 32px rgba(26,110,216,0.10)",
          width: "98vw",
          minHeight: "calc(100vh - 90px)",
          position: "relative",
          top: 0,
          boxSizing: "border-box",
          color: "#222",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            marginBottom: 22,
            background: "none",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 18,
            padding: 0,
            display: "flex",
            alignItems: "center",
            textShadow: "0 1px 4px rgba(26,110,216,0.15)"
          }}
        >
          <span style={{ fontSize: 24, marginRight: 8 }}>&larr;</span> Back
        </button>
        <h2 style={{ marginBottom: 14, fontWeight: 700, fontSize: "2rem", color: "#fff", textShadow: "0 1px 4px rgba(26,110,216,0.15)" }}>{job.title}</h2>
        <div style={{ color: "#e3e9f7", marginBottom: 14, fontSize: "1.15rem" }}>
          <span style={{ fontWeight: 600 }}>{job.company}</span> &middot; {job.date}
        </div>
        <div style={{ marginBottom: 18, flexWrap: "wrap" }}>
          {job.tags.map((tag, idx) => (
            <span
              key={idx}
              style={{
                background: "#fff",
                color: "#1a6ed8",
                borderRadius: 10,
                padding: "6px 16px",
                marginRight: 10,
                fontSize: 15,
                fontWeight: 500,
                display: "inline-block",
                marginBottom: 6,
                boxShadow: "0 1px 4px rgba(26,110,216,0.08)"
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <div style={{
          marginBottom: 26,
          color: "#fff",
          fontSize: "1.15rem",
          lineHeight: 1.7,
          background: "rgba(26,110,216,0.10)",
          borderRadius: 12,
          padding: "18px 18px 18px 18px",
          boxShadow: "0 1px 8px rgba(26,110,216,0.08)"
        }}>
          {job.description || "No description provided."}
        </div>
        <div style={{ fontWeight: 700, marginBottom: 32, fontSize: "1.18rem", color: "#fff" }}>
          Rate: <span style={{ color: "#000000" }}>{job.rate}</span>
        </div>
        {!applied ? (
          <form onSubmit={handleApply} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <label style={{ fontWeight: 600, marginBottom: 4, color: "#fff" }}>
              Upload Resume:
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
                required
                style={{
                  marginLeft: 10,
                  marginTop: 10,
                  border: "1px solid #cbd5e1",
                  borderRadius: 8,
                  padding: "8px 10px",
                  fontSize: 16,
                  width: "100%",
                  boxSizing: "border-box",
                  background: "#fff",
                  color: "#222"
                }}
              />
            </label>
            <button
              type="submit"
              style={{
                background: "#ffe066",
                color: "#1a6ed8",
                border: "none",
                borderRadius: 10,
                padding: "12px 0",
                fontWeight: 700,
                fontSize: "1.12rem",
                cursor: "pointer",
                marginTop: 8,
                transition: "background 0.2s",
                boxShadow: "0 2px 8px rgba(26,110,216,0.08)"
              }}
            >
              Apply
            </button>
          </form>
        ) : (
          <div
            style={{
              color: "#ffe066",
              fontWeight: 700,
              marginTop: 32,
              fontSize: "1.18rem",
              textAlign: "center",
              textShadow: "0 1px 4px rgba(26,110,216,0.15)"
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