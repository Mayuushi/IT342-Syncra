package com.edu.cit.Syncra.Repository;

import com.edu.cit.Syncra.Entity.Job;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends MongoRepository<Job, String> {

    // Find jobs that contain any of the provided tags
    List<Job> findByTagsIn(List<String> tags);

    // Find jobs by company name (contains)
    List<Job> findByCompanyContainingIgnoreCase(String company);

    // Find jobs by title (contains)
    List<Job> findByTitleContainingIgnoreCase(String title);
}