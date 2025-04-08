package com.edu.cit.Syncra.Service;

import com.edu.cit.Syncra.Entity.NewsFeed;
import com.edu.cit.Syncra.Entity.User;
import com.edu.cit.Syncra.Repository.NewsFeedRepository;
import com.edu.cit.Syncra.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NewsFeedService {

    @Autowired
    private NewsFeedRepository newsFeedRepository;

    @Autowired
    private UserRepository userRepository;

    public NewsFeed createPost(Long userId, NewsFeed newsFeed) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            newsFeed.setUser(user);
            return newsFeedRepository.save(newsFeed);
        }
        return null;
    }

    public List<NewsFeed> getAllPosts() {
        return newsFeedRepository.findAll();
    }

    public List<NewsFeed> getPostsByUserId(Long userId) {
        return newsFeedRepository.findByUserId(userId);
    }

    public void deletePost(Long id) {
        newsFeedRepository.deleteById(id);
    }
}
