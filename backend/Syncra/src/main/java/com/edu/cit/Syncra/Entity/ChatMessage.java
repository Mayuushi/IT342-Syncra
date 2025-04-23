package com.edu.cit.Syncra.Entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "messages")
public class ChatMessage {
    @Id
    private String id;

    private String senderId;
    private String receiverId;
    private String content;
    private Instant timestamp;
}
