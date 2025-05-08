package com.edu.cit.Syncra.Service;

import com.edu.cit.Syncra.Entity.Job;
import com.edu.cit.Syncra.Repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    // Get all jobs
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    // Get job by ID
    public Job getJobById(String id) {
        Optional<Job> job = jobRepository.findById(id);
        return job.orElse(null);
    }

    // Save a job (create or update)
    public Job saveJob(Job job) {
        return jobRepository.save(job);
    }

    // Delete a job
    public void deleteJob(String id) {
        jobRepository.deleteById(id);
    }

    // Find jobs by filters (working schedule and employment type)
    public List<Job> getFilteredJobs(List<String> workingSchedule, List<String> employmentType) {
        // If no filters are provided, return all jobs
        if ((workingSchedule == null || workingSchedule.isEmpty()) &&
                (employmentType == null || employmentType.isEmpty())) {
            return getAllJobs();
        }

        // Combine all filter tags
        List<String> allFilters = new ArrayList<>();
        if (workingSchedule != null && !workingSchedule.isEmpty()) {
            allFilters.addAll(workingSchedule);
        }
        if (employmentType != null && !employmentType.isEmpty()) {
            allFilters.addAll(employmentType);
        }

        // Get all jobs that have any of the filter tags
        List<Job> jobsWithAnyTag = jobRepository.findByTagsIn(allFilters);

        // If either filter list is empty, the corresponding check should be skipped
        return jobsWithAnyTag.stream().filter(job -> {
            boolean workingScheduleMatches = workingSchedule == null || workingSchedule.isEmpty() ||
                    workingSchedule.stream().anyMatch(ws -> job.getTags().contains(ws));

            boolean employmentTypeMatches = employmentType == null || employmentType.isEmpty() ||
                    employmentType.stream().anyMatch(et -> job.getTags().contains(et));

            return workingScheduleMatches && employmentTypeMatches;
        }).collect(Collectors.toList());
    }

    // Find jobs by company
    public List<Job> getJobsByCompany(String company) {
        return jobRepository.findByCompanyContainingIgnoreCase(company);
    }

    // Find jobs by title
    public List<Job> getJobsByTitle(String title) {
        return jobRepository.findByTitleContainingIgnoreCase(title);
    }
}