package com.edu.cit.Syncra.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.*;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.Map;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("https://it342-syncra-web.onrender.com")
                .setHandshakeHandler(new CustomHandshakeHandler())
                .withSockJS();
    }

    // Custom handshake handler to set principal
    private class CustomHandshakeHandler extends DefaultHandshakeHandler {
        @Override
        protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {
            // Get the email from the query parameters
            String email = request.getURI().getQuery();
            if (email != null && email.startsWith("email=")) {
                final String userEmail = email.substring(6); // Remove "email=" prefix

                // Return custom principal with the email
                return new Principal() {
                    @Override
                    public String getName() {
                        return userEmail;
                    }
                };
            }

            return super.determineUser(request, wsHandler, attributes);
        }
    }
}