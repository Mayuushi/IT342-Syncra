package com.edu.cit.Syncra.Repository;

import com.edu.cit.Syncra.Entity.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
// Correct method names
List<ChatMessage> findBySenderAndRecipient(String sender, String recipient);
List<ChatMessage> findByRecipient(String recipient);
}