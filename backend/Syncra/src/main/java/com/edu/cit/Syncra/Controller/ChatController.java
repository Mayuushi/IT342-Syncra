package com.edu.cit.Syncra.Controller;

import com.edu.cit.Syncra.Entity.ChatMessage;
import com.edu.cit.Syncra.Repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "https://it342-syncra-web.onrender.com")
@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageRepository messageRepository;

    @MessageMapping("/chat")
    public void sendPrivateMessage(@Payload ChatMessage message) {
        message.setTimestamp(LocalDateTime.now());

        // Save message to DB
        ChatMessage savedMessage = messageRepository.save(message);
        System.out.println("Message saved with ID: " + savedMessage.getId());

        // Send message to recipient
        messagingTemplate.convertAndSendToUser(
                message.getReceiverEmail(),
                "/queue/messages",
                savedMessage
        );
        System.out.println("Message sent to user: " + message.getReceiverEmail());
    }

    @GetMapping("/api/chat/history/{senderEmail}/{receiverEmail}")
    @ResponseBody
    public List<ChatMessage> getChatHistory(
            @PathVariable String senderEmail,
            @PathVariable String receiverEmail
    ) {
        return messageRepository.findBySenderEmailAndReceiverEmailOrReceiverEmailAndSenderEmail(
                senderEmail, receiverEmail, senderEmail, receiverEmail
        );
    }
}