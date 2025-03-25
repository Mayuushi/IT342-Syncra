package com.edu.cit.Syncra;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/login").permitAll()  // Public access to home & login
                        .anyRequest().authenticated()  // Require authentication for everything else
                )
                .oauth2Login(oauth2 -> oauth2
                        .defaultSuccessUrl("/dashboard", true) // Redirect after successful login
                )
                .logout(logout -> logout
                        .logoutSuccessUrl("/").permitAll()
                )
                .formLogin().disable() // Disables default login form
                .httpBasic().disable(); // Disables basic authentication

        return http.build();
    }
}
