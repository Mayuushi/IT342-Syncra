package com.edu.cit.Syncra.Repository;

import com.edu.cit.Syncra.Entity.Company;
import com.edu.cit.Syncra.Entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends MongoRepository<Company, String> {

    List<Company> findByOwner(User owner);

    Optional<Company> findByNameAndOwner(String name, User owner);

    List<Company> findByIndustry(String industry);

    List<Company> findByVerified(boolean verified);

    boolean existsByNameAndOwner(String name, User owner);
}