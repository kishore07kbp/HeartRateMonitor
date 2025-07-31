package com.example.Heart_Rate_Monitor.controller;

import com.example.Heart_Rate_Monitor.dto.LoginRequest;
import com.example.Heart_Rate_Monitor.dto.LoginResponse;
import com.example.Heart_Rate_Monitor.dto.SignupRequest;
import com.example.Heart_Rate_Monitor.dto.UserResponse;
import com.example.Heart_Rate_Monitor.model.User;
import com.example.Heart_Rate_Monitor.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public void signup(@RequestBody @Valid SignupRequest req) {
        userService.signup(req);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody @Valid LoginRequest req) {
        return userService.login(req);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(user);
    }


}
