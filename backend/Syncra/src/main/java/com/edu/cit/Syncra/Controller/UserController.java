package com.edu.cit.Syncra.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.edu.cit.Syncra.Entity.Job;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edu.cit.Syncra.Entity.User;
import com.edu.cit.Syncra.Service.UserService;
import com.edu.cit.Syncra.Service.JobService;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JobService jobService;


    // Get all users
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        System.out.println("Fetching all users");
        List<User> users = userService.getAllUsers();

        Map<String, Object> response = new HashMap<>();
        response.put("message", users.isEmpty() ? "No users found" : "List of users");
        response.put("users", users);

        return ResponseEntity.ok(response);
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable String id) {
        System.out.println("Fetching user with ID: " + id);
        User user = userService.getUserById(id);

        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "User retrieved successfully");
        response.put("user", user);

        return ResponseEntity.ok(response);
    }

    // Get user by Email
    @GetMapping("/email/{email}")
    public ResponseEntity<Map<String, Object>> getUserByEmail(@PathVariable String email) {
        System.out.println("Fetching user with email: " + email);
        User user = userService.getUserByEmail(email);

        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "User retrieved successfully");
        response.put("user", user);

        return ResponseEntity.ok(response);
    }

    // Create a new user
    @PostMapping
    public ResponseEntity<Map<String, Object>> createUser(@RequestBody User user) {
        System.out.println("Creating a new user");
        User savedUser = userService.saveUser(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "User created successfully");
        response.put("user", savedUser);

        return ResponseEntity.status(201).body(response); // 201 Created
    }

    // Update an existing user
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateUser(@PathVariable String id, @RequestBody User userDetails) {
        System.out.println("Updating user with ID: " + id);
        User existingUser = userService.getUserById(id);

        if (existingUser == null) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        existingUser.setName(userDetails.getName());
        existingUser.setEmail(userDetails.getEmail());
        existingUser.setPassword(userDetails.getPassword());
        User updatedUser = userService.saveUser(existingUser);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "User updated successfully");
        response.put("user", updatedUser);

        return ResponseEntity.ok(response);
    }

    // Delete a user
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable String id) {
        System.out.println("Deleting user with ID: " + id);
        User existingUser = userService.getUserById(id);

        if (existingUser == null) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        userService.deleteUser(id);

        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }


    // NEW ENDPOINTS FOR JOB FUNCTIONALITY

    // Get saved jobs for a user
    @GetMapping("/{id}/saved-jobs")
    public ResponseEntity<Map<String, Object>> getSavedJobs(@PathVariable String id) {
        System.out.println("Fetching saved jobs for user with ID: " + id);
        User user = userService.getUserById(id);

        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Saved jobs retrieved successfully");
        response.put("savedJobs", user.getSavedJobs() != null ? user.getSavedJobs() : List.of());

        return ResponseEntity.ok(response);
    }

    // Save a job for a user
    @PostMapping("/{userId}/saved-jobs/{jobId}")
    public ResponseEntity<Map<String, Object>> saveJob(@PathVariable String userId, @PathVariable String jobId) {
        System.out.println("Saving job " + jobId + " for user " + userId);
        User user = userService.getUserById(userId);
        Job job = jobService.getJobById(jobId);

        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        if (job == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Job not found"));
        }

        // Add the job to saved jobs if not already saved
        List<Job> savedJobs = user.getSavedJobs();
        if (savedJobs == null) {
            user.setSavedJobs(List.of(job));
        } else if (savedJobs.stream().noneMatch(j -> j.getId().equals(jobId))) {
            savedJobs.add(job);
        }

        User updatedUser = userService.saveUser(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Job saved successfully");
        response.put("savedJobs", updatedUser.getSavedJobs());

        return ResponseEntity.ok(response);
    }

    // Remove a job from saved jobs
    @DeleteMapping("/{userId}/saved-jobs/{jobId}")
    public ResponseEntity<Map<String, Object>> removeSavedJob(@PathVariable String userId, @PathVariable String jobId) {
        System.out.println("Removing job " + jobId + " from saved jobs for user " + userId);
        User user = userService.getUserById(userId);

        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        // Remove the job from saved jobs
        List<Job> savedJobs = user.getSavedJobs();
        if (savedJobs != null) {
            savedJobs.removeIf(job -> job.getId().equals(jobId));
        }

        User updatedUser = userService.saveUser(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Job removed from saved jobs");
        response.put("savedJobs", updatedUser.getSavedJobs());

        return ResponseEntity.ok(response);
    }

    // Get applied jobs for a user
    @GetMapping("/{id}/applied-jobs")
    public ResponseEntity<Map<String, Object>> getAppliedJobs(@PathVariable String id) {
        System.out.println("Fetching applied jobs for user with ID: " + id);
        User user = userService.getUserById(id);

        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Applied jobs retrieved successfully");
        response.put("appliedJobs", user.getAppliedJobs() != null ? user.getAppliedJobs() : List.of());

        return ResponseEntity.ok(response);
    }

    // Apply for a job
    @PostMapping("/{userId}/applied-jobs/{jobId}")
    public ResponseEntity<Map<String, Object>> applyForJob(@PathVariable String userId, @PathVariable String jobId) {
        System.out.println("Applying for job " + jobId + " for user " + userId);
        User user = userService.getUserById(userId);
        Job job = jobService.getJobById(jobId);

        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        if (job == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Job not found"));
        }

        // Add the job to applied jobs if not already applied
        List<Job> appliedJobs = user.getAppliedJobs();
        if (appliedJobs == null) {
            user.setAppliedJobs(List.of(job));
        } else if (appliedJobs.stream().noneMatch(j -> j.getId().equals(jobId))) {
            appliedJobs.add(job);
        }

        User updatedUser = userService.saveUser(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Job application submitted successfully");
        response.put("appliedJobs", updatedUser.getAppliedJobs());

        return ResponseEntity.ok(response);
    }

    // Update user profile for job applications
    @PutMapping("/{id}/job-profile")
    public ResponseEntity<Map<String, Object>> updateJobProfile(
            @PathVariable String id,
            @RequestBody Map<String, Object> profileDetails) {

        System.out.println("Updating job profile for user with ID: " + id);
        User user = userService.getUserById(id);

        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        // Update job profile fields
        if (profileDetails.containsKey("resumeUrl")) {
            user.setResumeUrl((String) profileDetails.get("resumeUrl"));
        }
        if (profileDetails.containsKey("jobTitle")) {
            user.setJobTitle((String) profileDetails.get("jobTitle"));
        }
        if (profileDetails.containsKey("skills")) {
            @SuppressWarnings("unchecked")
            List<String> skills = (List<String>) profileDetails.get("skills");
            user.setSkills(skills);
        }
        if (profileDetails.containsKey("experience")) {
            user.setExperience((String) profileDetails.get("experience"));
        }
        if (profileDetails.containsKey("education")) {
            user.setEducation((String) profileDetails.get("education"));
        }

        User updatedUser = userService.saveUser(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Job profile updated successfully");
        response.put("user", updatedUser);

        return ResponseEntity.ok(response);
    }
}
