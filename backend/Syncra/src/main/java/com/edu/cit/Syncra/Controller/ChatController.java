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
import java.security.Principal;

@CrossOrigin(origins = "https://it342-syncra-web.onrender.com")
@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageRepository messageRepository;

    @MessageMapping("/chat")
    public void sendPrivateMessage(@Payload ChatMessage message) {
        // Set timestamp if not already set
        if (message.getTimestamp() == null) {
            message.setTimestamp(LocalDateTime.now());
        }

        // Debug info
        System.out.println("Received message from: " + message.getSenderEmail());
        System.out.println("Destination: " + message.getReceiverEmail());
        System.out.println("Content: " + message.getContent());

        try {
            // Save message to database
            ChatMessage savedMessage = messageRepository.save(message);
            System.out.println("Message saved with ID: " + savedMessage.getId());

            // Send to receiver - this is the critical part
            System.out.println("Sending to user destination: /user/" + message.getReceiverEmail() + "/queue/messages");
            messagingTemplate.convertAndSendToUser(
                    message.getReceiverEmail(),
                    "/queue/messages",
                    savedMessage
            );
            System.out.println("Message sent to recipient queue");

        } catch (Exception e) {
            System.err.println("Error processing message: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @GetMapping("/api/chat/history/{senderEmail}/{receiverEmail}")
    @ResponseBody
    public List<ChatMessage> getChatHistory(
            @PathVariable String senderEmail,
            @PathVariable String receiverEmail
    ) {
        System.out.println("Getting chat history between " + senderEmail + " and " + receiverEmail);
        return messageRepository.findBySenderEmailAndReceiverEmailOrReceiverEmailAndSenderEmail(
                senderEmail, receiverEmail, senderEmail, receiverEmail
        );
    }
}