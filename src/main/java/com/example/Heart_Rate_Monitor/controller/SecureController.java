package com.example.Heart_Rate_Monitor.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SecureController {

    @GetMapping("/secure")
    public String secureEndpoint(Authentication authentication) {
        // Authentication object will hold the JWT principal (email)
        return "Hello, " + authentication.getName() + "! Your token is valid.";
    }
}
