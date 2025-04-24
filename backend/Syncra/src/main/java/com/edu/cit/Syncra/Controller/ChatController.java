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
import java.util.Comparator;
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
    public void sendPrivateMessage(@Payload ChatMessage message, Principal principal) {
        message.setTimestamp(LocalDateTime.now());

        // Print debug info
        System.out.println("Processing message from: " + message.getSenderEmail());
        System.out.println("To: " + message.getReceiverEmail());
        System.out.println("Content: " + message.getContent());
        System.out.println("Principal: " + (principal != null ? principal.getName() : "null"));

        // Validate sender and receiver
        if (message.getSenderEmail() == null || message.getReceiverEmail() == null) {
            System.err.println("Error: Sender or receiver email is null");
            return;
        }

        try {
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

            // Also send confirmation back to sender
            messagingTemplate.convertAndSendToUser(
                    message.getSenderEmail(),
                    "/queue/confirmations",
                    savedMessage.getId()
            );

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

        try {
            List<ChatMessage> messages = messageRepository.findBySenderEmailAndReceiverEmailOrReceiverEmailAndSenderEmail(
                    senderEmail, receiverEmail, senderEmail, receiverEmail
            );

            // Sort messages by timestamp
            messages.sort(Comparator.comparing(ChatMessage::getTimestamp));

            System.out.println("Found " + messages.size() + " messages");
            return messages;
        } catch (Exception e) {
            System.err.println("Error retrieving chat history: " + e.getMessage());
            e.printStackTrace();
            return List.of(); // Return empty list on error
        }
    }
}