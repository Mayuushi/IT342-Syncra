package com.edu.cit.Syncra.Repository;

import com.edu.cit.Syncra.Entity.Portfolio;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PortfolioRepository extends MongoRepository<Portfolio, Long> {
    List<Portfolio> findByUserId(Long userId);
}
