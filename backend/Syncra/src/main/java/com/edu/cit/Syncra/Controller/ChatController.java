package com.edu.cit.Syncra.Controller;

import com.edu.cit.Syncra.Entity.ChatMessage;
import com.edu.cit.Syncra.Service.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "https://it342-syncra-web.onrender.com")
@RestController
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    public ChatController(SimpMessagingTemplate messagingTemplate, ChatService chatService) {
        this.messagingTemplate = messagingTemplate;
        this.chatService = chatService;
    }

    @MessageMapping("/chat.send")
    public void sendMessage(ChatMessage message) {
        message.setTimestamp(LocalDateTime.now());  
        messagingTemplate.convertAndSendToUser(
                message.getReceiverId(), "/queue/messages", message
        );
    }

    @GetMapping("/chat/{user1}/{user2}")
    public List<ChatMessage> getMessages(@PathVariable String user1, @PathVariable String user2) {
        return chatService.getChatHistory(user1, user2);
    }
}

