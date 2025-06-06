package com.edu.cit.Syncra.Controller;

import com.edu.cit.Syncra.Entity.Portfolio;
import com.edu.cit.Syncra.Entity.User;
import com.edu.cit.Syncra.Service.PortfolioService;
import com.edu.cit.Syncra.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    @Autowired
    private PortfolioService portfolioService;

    @Autowired
    private UserService userService;

    @PostMapping("/user/{userId}")
    public ResponseEntity<?> createPortfolio(@PathVariable String userId, @RequestBody Portfolio portfolio) {
        User user = userService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        portfolio.setUser(user);
        return ResponseEntity.status(201).body(portfolioService.createPortfolio(portfolio));
    }

    @GetMapping
    public List<Portfolio> getAllPortfolios() {
        return portfolioService.getAllPortfolios();
    }

    @GetMapping("/user/{userId}")
    public List<Portfolio> getUserPortfolios(@PathVariable String userId) {
        return portfolioService.getPortfoliosByUserId(userId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletePortfolio(@PathVariable String id) {
        portfolioService.deletePortfolio(id);
        return ResponseEntity.ok(Map.of("message", "Portfolio deleted successfully"));
    }
}
