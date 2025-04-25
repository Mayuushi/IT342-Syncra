package com.edu.cit.Syncra.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edu.cit.Syncra.Entity.NewsFeed;
import com.edu.cit.Syncra.Service.NewsFeedService;

@CrossOrigin(origins = "https://it342-syncra-web.onrender.com")
@RestController
@RequestMapping("/api/newsfeed")
public class NewsFeedController {

    @Autowired
    private NewsFeedService newsFeedService;

    @PostMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> createPost(@PathVariable String userId, @RequestBody NewsFeed post) {
        NewsFeed created = newsFeedService.createPost(userId, post);
        if (created == null) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }
        return ResponseEntity.status(201).body(Map.of("message", "Post created successfully", "post", created));
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllPosts() {
        return ResponseEntity.ok(Map.of("message", "All posts", "posts", newsFeedService.getAllPosts()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getPostsByUser(@PathVariable String id) {
        return ResponseEntity.ok(Map.of("message", "User posts", "posts", newsFeedService.getPostsByUserId(id)));
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getPostsByUserId(@PathVariable String userId) {
        List<NewsFeed> posts = newsFeedService.getPostsByUserId(userId);
        return ResponseEntity.ok(Map.of(
                "message", "Posts by user ID: " + userId,
                "posts", posts
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deletePost(@PathVariable Long id) {
        newsFeedService.deletePost(id);
        return ResponseEntity.ok(Map.of("message", "Post deleted successfully"));
    }
}
