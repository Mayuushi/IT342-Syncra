package com.edu.cit.Syncra.Service;

import com.edu.cit.Syncra.Entity.User;
import com.edu.cit.Syncra.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.edu.cit.Syncra.Entity.Job;
import com.edu.cit.Syncra.Repository.JobRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Retrieve all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Retrieve user by ID
    public User getUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    // Create or Update a user
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    // Delete a user
    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
    public User getUserByEmail(String email){
        return userRepository.findByEmail(email).orElse(null);
    }

    // Add a job to user's saved jobs
    public User addSavedJob(String userId, Job job) {
        User user = getUserById(userId);
        if (user == null) {
            return null;
        }

        List<Job> savedJobs = user.getSavedJobs();
        if (savedJobs == null) {
            savedJobs = new ArrayList<>();
            user.setSavedJobs(savedJobs);
        }

        // Check if job is already saved
        boolean jobAlreadySaved = savedJobs.stream()
                .anyMatch(j -> j.getId().equals(job.getId()));

        if (!jobAlreadySaved) {
            savedJobs.add(job);
            return saveUser(user);
        }

        return user;
    }

    // Remove a job from user's saved jobs
    public User removeSavedJob(String userId, String jobId) {
        User user = getUserById(userId);
        if (user == null) {
            return null;
        }

        List<Job> savedJobs = user.getSavedJobs();
        if (savedJobs != null) {
            savedJobs.removeIf(job -> job.getId().equals(jobId));
            return saveUser(user);
        }

        return user;
    }

    // Add a job to user's applied jobs
    public User addAppliedJob(String userId, Job job) {
        User user = getUserById(userId);
        if (user == null) {
            return null;
        }

        List<Job> appliedJobs = user.getAppliedJobs();
        if (appliedJobs == null) {
            appliedJobs = new ArrayList<>();
            user.setAppliedJobs(appliedJobs);
        }

        // Check if job is already applied to
        boolean jobAlreadyApplied = appliedJobs.stream()
                .anyMatch(j -> j.getId().equals(job.getId()));

        if (!jobAlreadyApplied) {
            appliedJobs.add(job);
            return saveUser(user);
        }

        return user;
    }

    // Update user's job profile information
    public User updateJobProfile(String userId, User profileUpdates) {
        User user = getUserById(userId);
        if (user == null) {
            return null;
        }

        // Update only the job profile fields
        if (profileUpdates.getResumeUrl() != null) {
            user.setResumeUrl(profileUpdates.getResumeUrl());
        }
        if (profileUpdates.getJobTitle() != null) {
            user.setJobTitle(profileUpdates.getJobTitle());
        }
        if (profileUpdates.getSkills() != null) {
            user.setSkills(profileUpdates.getSkills());
        }
        if (profileUpdates.getExperience() != null) {
            user.setExperience(profileUpdates.getExperience());
        }
        if (profileUpdates.getEducation() != null) {
            user.setEducation(profileUpdates.getEducation());
        }

        return saveUser(user);
    }
}
