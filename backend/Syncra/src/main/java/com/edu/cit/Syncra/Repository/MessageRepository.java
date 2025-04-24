package com.edu.cit.Syncra.Repository;

import com.edu.cit.Syncra.Entity.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findBySenderEmailAndReceiverEmailOrReceiverEmailAndSenderEmail(
            String senderEmail1, String receiverEmail1, String receiverEmail2, String senderEmail2);
}
