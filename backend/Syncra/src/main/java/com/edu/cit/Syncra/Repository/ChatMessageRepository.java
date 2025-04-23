package com.edu.cit.Syncra.Repository;

import com.edu.cit.Syncra.Entity.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findBySenderIdAndReceiverIdOrReceiverIdAndSenderId(String sender1, String receiver1, String sender2, String receiver2);
}
