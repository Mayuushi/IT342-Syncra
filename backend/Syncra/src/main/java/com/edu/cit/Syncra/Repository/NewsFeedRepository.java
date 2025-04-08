package com.edu.cit.Syncra.Repository;

import com.edu.cit.Syncra.Entity.NewsFeed;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NewsFeedRepository extends JpaRepository<NewsFeed, Long> {
    List<NewsFeed> findByUserId(Long userId);
}
