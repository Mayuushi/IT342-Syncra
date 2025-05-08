package com.edu.cit.Syncra.Controller;

import com.edu.cit.Syncra.Entity.Job;
import com.edu.cit.Syncra.Service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    // Get all jobs
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllJobs() {
        System.out.println("Fetching all jobs");
        List<Job> jobs = jobService.getAllJobs();

        Map<String, Object> response = new HashMap<>();
        response.put("message", jobs.isEmpty() ? "No jobs found" : "List of jobs");
        response.put("jobs", jobs);

        return ResponseEntity.ok(response);
    }

    // Get job by ID
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getJobById(@PathVariable String id) {
        System.out.println("Fetching job with ID: " + id);
        Job job = jobService.getJobById(id);

        if (job == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Job not found"));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Job retrieved successfully");
        response.put("job", job);

        return ResponseEntity.ok(response);
    }

    // Create a new job
    @PostMapping
    public ResponseEntity<Map<String, Object>> createJob(@RequestBody Job job) {
        System.out.println("Creating a new job");
        Job savedJob = jobService.saveJob(job);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Job created successfully");
        response.put("job", savedJob);

        return ResponseEntity.status(201).body(response);
    }

    // Update an existing job
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateJob(@PathVariable String id, @RequestBody Job jobDetails) {
        System.out.println("Updating job with ID: " + id);
        Job existingJob = jobService.getJobById(id);

        if (existingJob == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Job not found"));
        }

        // Update job fields
        existingJob.setCompany(jobDetails.getCompany());
        existingJob.setTitle(jobDetails.getTitle());
        existingJob.setDate(jobDetails.getDate());
        existingJob.setTags(jobDetails.getTags());
        existingJob.setRate(jobDetails.getRate());
        existingJob.setDescription(jobDetails.getDescription());
        existingJob.setLocation(jobDetails.getLocation());
        existingJob.setApplicationUrl(jobDetails.getApplicationUrl());

        Job updatedJob = jobService.saveJob(existingJob);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Job updated successfully");
        response.put("job", updatedJob);

        return ResponseEntity.ok(response);
    }

    // Delete a job
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteJob(@PathVariable String id) {
        System.out.println("Deleting job with ID: " + id);
        Job existingJob = jobService.getJobById(id);

        if (existingJob == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Job not found"));
        }

        jobService.deleteJob(id);

        return ResponseEntity.ok(Map.of("message", "Job deleted successfully"));
    }

    // Filter jobs by working schedule and employment type
    @GetMapping("/filter")
    public ResponseEntity<Map<String, Object>> getFilteredJobs(
            @RequestParam(required = false) List<String> workingSchedule,
            @RequestParam(required = false) List<String> employmentType) {

        System.out.println("Filtering jobs - Working Schedule: " + workingSchedule + ", Employment Type: " + employmentType);
        List<Job> filteredJobs = jobService.getFilteredJobs(workingSchedule, employmentType);

        Map<String, Object> response = new HashMap<>();
        response.put("message", filteredJobs.isEmpty() ? "No jobs found matching the criteria" : "Filtered list of jobs");
        response.put("jobs", filteredJobs);

        return ResponseEntity.ok(response);
    }

    // Get jobs by company
    @GetMapping("/company/{company}")
    public ResponseEntity<Map<String, Object>> getJobsByCompany(@PathVariable String company) {
        System.out.println("Fetching jobs for company: " + company);
        List<Job> jobs = jobService.getJobsByCompany(company);

        Map<String, Object> response = new HashMap<>();
        response.put("message", jobs.isEmpty() ? "No jobs found for this company" : "List of jobs for " + company);
        response.put("jobs", jobs);

        return ResponseEntity.ok(response);
    }

    // Get jobs by title
    @GetMapping("/title/{title}")
    public ResponseEntity<Map<String, Object>> getJobsByTitle(@PathVariable String title) {
        System.out.println("Fetching jobs with title containing: " + title);
        List<Job> jobs = jobService.getJobsByTitle(title);

        Map<String, Object> response = new HashMap<>();
        response.put("message", jobs.isEmpty() ? "No jobs found with this title" : "List of jobs with title containing " + title);
        response.put("jobs", jobs);

        return ResponseEntity.ok(response);
    }
}