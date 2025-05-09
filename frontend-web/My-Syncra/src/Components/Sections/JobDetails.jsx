import React, { useState, useEffect } from "react";

export default function JobDetailsDebug() {
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("Initializing...");
  
  // Test with a sample job ID - this would need to be replaced with a valid ID
  const testJobId = "681d3fb7ee9dfc34d6821ced";
  
  useEffect(() => {
    const debugFetch = async () => {
      try {
        setStatus("Making API request...");
        const API_BASE_URL = 'https://it342-syncra.onrender.com/api/jobs';
        
        // Use fetch instead of axios
        const response = await fetch(`${API_BASE_URL}/${testJobId}`);
        
        setStatus("Response received! Checking data...");
        
        if (!response.ok) {
          throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("API Response:", data);
        
        if (data && data.job) {
          setJobData(data.job);
          setStatus("Job data found!");
        } else {
          setError("Job data not found in the response structure");
          setStatus("Error: Unexpected response structure");
        }
      } catch (err) {
        console.error("Debug Error:", err);
        setError(err.message || "Unknown error occurred");
        setStatus(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    debugFetch();
  }, []);
  
  return (
    <div className="debug-container p-5 font-mono">
      <h2 className="text-xl font-bold mb-4">Job API Debug</h2>
      <div className="status-panel mb-4 p-3 bg-gray-100 rounded">
        <strong>Status:</strong> {status}
      </div>
      
      {loading && <div className="text-blue-500">Loading...</div>}
      
      {error && (
        <div className="text-red-500 mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {jobData && (
        <div>
          <h3 className="font-bold mt-4 mb-2">Job Data Found:</h3>
          <pre className="bg-gray-100 p-3 overflow-x-auto rounded">
            {JSON.stringify(jobData, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-6 border-t pt-4">
        <h3 className="font-bold mb-2">Possible Issues:</h3>
        <ul className="list-disc pl-5">
          <li>API endpoint may be incorrect</li>
          <li>Job ID might be invalid</li>
          <li>Response structure might not contain a 'job' property</li>
          <li>Backend server might be down or inaccessible</li>
          <li>CORS issues might be blocking the request</li>
        </ul>
      </div>
    </div>
  );
}