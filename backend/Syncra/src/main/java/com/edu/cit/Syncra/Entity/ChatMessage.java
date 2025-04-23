package com.edu.cit.Syncra.Entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Setter
@Getter
@Document(collection = "messages") // MongoDB collection name
public class ChatMessage {
    // Getters and Setters
    @Id
    private String id; // Unique identifier for MongoDB
    private String sender;
    private String recipient;
    private String content;
    private LocalDateTime timestamp;

}