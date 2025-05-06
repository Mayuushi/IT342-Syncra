package com.edu.cit.Syncra.Controller;

import com.edu.cit.Syncra.Entity.Company;
import com.edu.cit.Syncra.Entity.Job;
import com.edu.cit.Syncra.Service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    /**
     * Create a new company
     */
    @PostMapping
    public ResponseEntity<Company> createCompany(
            @RequestBody Company company,
            @RequestParam String userId) {
        try {
            Company createdCompany = companyService.createCompany(company, userId);
            return new ResponseEntity<>(createdCompany, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Get company by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Company> getCompanyById(@PathVariable String id) {
        try {
            Company company = companyService.getCompanyById(id);
            return new ResponseEntity<>(company, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Get all companies owned by a user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Company>> getCompaniesByUser(@PathVariable String userId) {
        try {
            List<Company> companies = companyService.getCompaniesByUser(userId);
            return new ResponseEntity<>(companies, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Update company details
     */
    @PutMapping("/{id}")
    public ResponseEntity<Company> updateCompany(
            @PathVariable String id,
            @RequestBody Company company,
            @RequestParam String userId) {
        try {
            Company updatedCompany = companyService.updateCompany(id, company, userId);
            return new ResponseEntity<>(updatedCompany, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Delete a company
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompany(
            @PathVariable String id,
            @RequestParam String userId) {
        try {
            companyService.deleteCompany(id, userId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Post a job as a company
     */
    @PostMapping("/{id}/jobs")
    public ResponseEntity<Job> postJob(
            @PathVariable String id,
            @RequestBody Job job,
            @RequestParam String userId) {
        try {
            Job postedJob = companyService.postJob(id, job, userId);
            return new ResponseEntity<>(postedJob, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Get all jobs posted by a company
     */
    @GetMapping("/{id}/jobs")
    public ResponseEntity<List<Job>> getCompanyJobs(@PathVariable String id) {
        try {
            List<Job> jobs = companyService.getCompanyJobs(id);
            return new ResponseEntity<>(jobs, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Get all companies (for admin panel)
     */
    @GetMapping
    public ResponseEntity<List<Company>> getAllCompanies() {
        List<Company> companies = companyService.getAllCompanies();
        return new ResponseEntity<>(companies, HttpStatus.OK);
    }

    /**
     * Toggle company verification status (admin function)
     */
    @PatchMapping("/{id}/verify")
    public ResponseEntity<Company> toggleVerification(@PathVariable String id) {
        try {
            Company company = companyService.toggleVerification(id);
            return new ResponseEntity<>(company, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}