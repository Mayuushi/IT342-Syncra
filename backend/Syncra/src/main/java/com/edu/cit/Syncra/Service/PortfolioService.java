package com.edu.cit.Syncra.Service;

import com.edu.cit.Syncra.Entity.Portfolio;
import com.edu.cit.Syncra.Repository.PortfolioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PortfolioService {

    @Autowired
    private PortfolioRepository portfolioRepository;

    public Portfolio createPortfolio(Portfolio portfolio) {
        return portfolioRepository.save(portfolio);
    }

    public List<Portfolio> getAllPortfolios() {
        return portfolioRepository.findAll();
    }

    public List<Portfolio> getPortfoliosByUserId(String userId) {
        return portfolioRepository.findByUserId(userId);
    }

    public void deletePortfolio(String id) {
        portfolioRepository.deleteById(id);
    }
}
