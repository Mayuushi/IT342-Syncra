package com.edu.cit.Syncra.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;
import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean;

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
        // Configure message broker with increased buffer sizes
        config.enableSimpleBroker("/topic", "/queue")
                .setTaskScheduler(new org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler())
                .setHeartbeatValue(new long[] {10000, 10000});

        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("https://it342-syncra-web.onrender.com")
                .setHandshakeHandler(new CustomHandshakeHandler())
                .withSockJS()
                .setDisconnectDelay(30 * 1000)
                .setClientLibraryUrl("https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js");
    }

    @Bean
    public ServletServerContainerFactoryBean createWebSocketContainer() {
        ServletServerContainerFactoryBean container = new ServletServerContainerFactoryBean();
        container.setMaxTextMessageBufferSize(8192);
        container.setMaxBinaryMessageBufferSize(8192);
        container.setAsyncSendTimeout(30000L);
        return container;
    }

    // Custom handshake handler to set principal
    private class CustomHandshakeHandler extends DefaultHandshakeHandler {
        @Override
        protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {
            // Get the email from the query parameters
            String query = request.getURI().getQuery();
            if (query != null && query.contains("email=")) {
                final String userEmail = extractEmail(query);

                if (userEmail != null && !userEmail.isEmpty()) {
                    // Log successful principal creation
                    System.out.println("Creating WebSocket principal for user: " + userEmail);

                    // Return custom principal with the email
                    return new Principal() {
                        @Override
                        public String getName() {
                            return userEmail;
                        }
                    };
                }
            }

            System.out.println("Warning: Could not determine user from request: " + request.getURI());
            return super.determineUser(request, wsHandler, attributes);
        }

        private String extractEmail(String query) {
            // Handle more complex query strings
            String[] params = query.split("&");
            for (String param : params) {
                if (param.startsWith("email=")) {
                    return param.substring(6); // Remove "email=" prefix
                }
            }
            return null;
        }
    }
}