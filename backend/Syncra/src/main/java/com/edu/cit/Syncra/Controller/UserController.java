package com.edu.cit.Syncra.Controller;

import com.edu.cit.Syncra.Entity.User;
import com.edu.cit.Syncra.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

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
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable Long id) {
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
    public ResponseEntity<Map<String, Object>> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        System.out.println("Updating user with ID: " + id);
        User existingUser = userService.getUserById(id);

        if (existingUser == null) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        existingUser.setName(userDetails.getName());
        existingUser.setEmail(userDetails.getEmail());
        existingUser.setPassword(userDetails.getPassword());
        existingUser.setPost(userDetails.getPost());
        User updatedUser = userService.saveUser(existingUser);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "User updated successfully");
        response.put("user", updatedUser);

        return ResponseEntity.ok(response);
    }

    // Delete a user
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long id) {
        System.out.println("Deleting user with ID: " + id);
        User existingUser = userService.getUserById(id);

        if (existingUser == null) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        userService.deleteUser(id);

        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }
}
