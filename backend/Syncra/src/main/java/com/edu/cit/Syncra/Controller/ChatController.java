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
        messageRepository.save(message);

        // Prevent sending to null user
        if (message.getReceiverEmail() != null) {
            messagingTemplate.convertAndSendToUser(
                    message.getReceiverEmail(), "/queue/messages", message
            );
            System.out.println("Incoming message: " + message);
        } else {
            // Optionally log or throw a more descriptive error
            System.err.println("Receiver email is null. Message not sent.");
        }
    }


    @GetMapping("/api/chat/history/{senderEmail}/{receiverEmail}")
    @ResponseBody
    public List<ChatMessage> getChatHistory(@PathVariable String senderEmail, @PathVariable String receiverEmail) {
        return messageRepository.findBySenderEmailAndReceiverEmailOrReceiverEmailAndSenderEmail(
                senderEmail, receiverEmail, senderEmail, receiverEmail
        );
    }
}

