package com.edu.cit.Syncra.Controller;

import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Map;

@Controller
public class HomeController {

    @GetMapping("/dashboard")
    public String dashboard(OAuth2AuthenticationToken authentication, Model model) {
        if (authentication != null) {
            Map<String, Object> attributes = authentication.getPrincipal().getAttributes();

            model.addAttribute("userName", attributes.get("name"));
            model.addAttribute("userEmail", attributes.get("email"));
            model.addAttribute("userPicture", attributes.get("picture"));
        }
        return "dashboard";
    }
}
