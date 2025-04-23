package com.edu.cit.Syncra.Service;

import com.edu.cit.Syncra.Entity.ChatMessage;
import com.edu.cit.Syncra.Repository.ChatMessageRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class ChatService {
    private final ChatMessageRepository repository;

    public ChatService(ChatMessageRepository repository) {
        this.repository = repository;
    }

    public ChatMessage save(ChatMessage message) {
        message.setTimestamp(Instant.now());
        return repository.save(message);
    }

    public List<ChatMessage> getChatHistory(String user1, String user2) {
        return repository.findBySenderIdAndReceiverIdOrReceiverIdAndSenderId(user1, user2, user1, user2);
    }
}
