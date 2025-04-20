package com.edu.cit.Syncra.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.time.LocalDateTime;

@Document(collection = "news_feed")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsFeed {

    @Id
    private String id;  // Mongo uses String _id by default

    private String content;
    private String imageUrl;
    private LocalDateTime createdAt;

    @DBRef
    @JsonIgnoreProperties({"newsFeeds", "password"})
    private User user;

    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

}
