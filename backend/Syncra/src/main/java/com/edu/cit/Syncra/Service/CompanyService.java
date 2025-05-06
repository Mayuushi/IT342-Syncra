package com.edu.cit.Syncra.Service;

import com.edu.cit.Syncra.Entity.Company;
import com.edu.cit.Syncra.Entity.Job;
import com.edu.cit.Syncra.Entity.User;
import com.edu.cit.Syncra.Repository.CompanyRepository;
import com.edu.cit.Syncra.Repository.JobRepository;
import com.edu.cit.Syncra.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;

    /**
     * Create a new company
     */
    public Company createCompany(Company company, String ownerId) {
        Optional<User> userOptional = userRepository.findById(ownerId);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User owner = userOptional.get();

        // Check if the user already owns a company with the same name
        if (companyRepository.existsByNameAndOwner(company.getName(), owner)) {
            throw new RuntimeException("You already have a company with this name");
        }

        // Set company owner and timestamps
        company.setOwner(owner);
        company.setCreatedAt(new Date());
        company.setUpdatedAt(new Date());

        return companyRepository.save(company);
    }

    /**
     * Get company by ID
     */
    public Company getCompanyById(String id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));
    }

    /**
     * Get all companies owned by a user
     */
    public List<Company> getCompaniesByUser(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        return companyRepository.findByOwner(userOptional.get());
    }

    /**
     * Update company details
     */
    public Company updateCompany(String companyId, Company updatedCompany, String userId) {
        Company existingCompany = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        // Check if the user is the owner of the company
        if (!existingCompany.getOwner().getId().equals(userId)) {
            throw new RuntimeException("You are not authorized to update this company");
        }

        // Update fields
        existingCompany.setName(updatedCompany.getName());
        existingCompany.setDescription(updatedCompany.getDescription());
        existingCompany.setWebsiteUrl(updatedCompany.getWebsiteUrl());
        existingCompany.setLogoUrl(updatedCompany.getLogoUrl());
        existingCompany.setIndustry(updatedCompany.getIndustry());
        existingCompany.setLocation(updatedCompany.getLocation());
        existingCompany.setSize(updatedCompany.getSize());
        existingCompany.setEmail(updatedCompany.getEmail());
        existingCompany.setPhone(updatedCompany.getPhone());
        existingCompany.setUpdatedAt(new Date());

        return companyRepository.save(existingCompany);
    }

    /**
     * Delete a company
     */
    public void deleteCompany(String companyId, String userId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        // Check if the user is the owner of the company
        if (!company.getOwner().getId().equals(userId)) {
            throw new RuntimeException("You are not authorized to delete this company");
        }

        companyRepository.delete(company);
    }

    /**
     * Post a job as a company
     */
    public Job postJob(String companyId, Job job, String userId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        // Check if the user is the owner of the company
        if (!company.getOwner().getId().equals(userId)) {
            throw new RuntimeException("You are not authorized to post jobs for this company");
        }

        // Set company name in the job
        job.setCompany(company.getName());
        job.setDate(new Date().toString());

        // Save the job
        Job savedJob = jobRepository.save(job);

        // Add the job to company's posted jobs
        company.getPostedJobs().add(savedJob);
        companyRepository.save(company);

        return savedJob;
    }

    /**
     * Get all jobs posted by a company
     */
    public List<Job> getCompanyJobs(String companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        return company.getPostedJobs();
    }

    /**
     * Get all companies (paginated for admin use)
     */
    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    /**
     * Toggle company verification status (admin function)
     */
    public Company toggleVerification(String companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        company.setVerified(!company.isVerified());
        return companyRepository.save(company);
    }
}