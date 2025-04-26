package com.edu.cit.Syncra.Repository;

import com.edu.cit.Syncra.Entity.NewsFeed;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NewsFeedRepository extends MongoRepository<NewsFeed, String> {
    List<NewsFeed> findByUserId(String userId);
}
