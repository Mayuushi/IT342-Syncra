package com.edu.cit.Syncra.Controller;

import com.edu.cit.Syncra.Entity.ChatMessage;
import com.edu.cit.Syncra.Repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageRepository messageRepository;

    @MessageMapping("/chat")
    public void sendPrivateMessage(@Payload ChatMessage message) {
        message.setTimestamp(LocalDateTime.now());
        messageRepository.save(message);

        messagingTemplate.convertAndSendToUser(
                message.getReceiverId(), "/queue/messages", message
        );
    }
}
