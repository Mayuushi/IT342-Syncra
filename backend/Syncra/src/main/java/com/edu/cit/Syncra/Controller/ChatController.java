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
    import org.springframework.messaging.handler.annotation.Header;
    import org.springframework.messaging.simp.SimpMessageHeaderAccessor;

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

            // Save message to DB
            ChatMessage savedMessage = messageRepository.save(message);
            System.out.println("Message saved with ID: " + savedMessage.getId());

            // Prevent sending to null user
            if (message.getReceiverEmail() != null) {
                try {
                    // Send message to recipient
                    messagingTemplate.convertAndSendToUser(
                            message.getReceiverEmail(),
                            "/queue/messages",
                            message
                    );
                    System.out.println("Message sent to user: " + message.getReceiverEmail());
                } catch (Exception e) {
                    System.err.println("Error sending message: " + e.getMessage());
                    e.printStackTrace();
                }
            } else {
                System.err.println("Receiver email is null. Message not sent.");
            }
        }

        @GetMapping("/api/chat/history/{senderEmail}/{receiverEmail}")
        @ResponseBody
        public List<ChatMessage> getChatHistory(
                @PathVariable String senderEmail,
                @PathVariable String receiverEmail
        ) {
            System.out.println("Getting chat history between " + senderEmail + " and " + receiverEmail);
            List<ChatMessage> messages = messageRepository.findBySenderEmailAndReceiverEmailOrReceiverEmailAndSenderEmail(
                    senderEmail, receiverEmail, senderEmail, receiverEmail
            );
            System.out.println("Found " + messages.size() + " messages");
            return messages;
        }
    }