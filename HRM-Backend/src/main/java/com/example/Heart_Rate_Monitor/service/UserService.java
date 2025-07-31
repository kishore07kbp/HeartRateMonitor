package com.example.Heart_Rate_Monitor.service;

import com.example.Heart_Rate_Monitor.dto.LoginRequest;
import com.example.Heart_Rate_Monitor.dto.LoginResponse;
import com.example.Heart_Rate_Monitor.dto.SignupRequest;
import com.example.Heart_Rate_Monitor.model.User;
import com.example.Heart_Rate_Monitor.repo.UserRepository;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository repo;
    private final JwtService jwtService;

    public UserService(UserRepository repo, JwtService jwtService) {
        this.repo = repo;
        this.jwtService = jwtService;
    }

    public void signup(SignupRequest req) {
        if (repo.findByEmail(req.email()).isPresent()) {
            throw new RuntimeException("Email already used");
        }
        User u = new User();
        u.setName(req.name());
        u.setAge(req.age());
        u.setEmail(req.email());
        u.setPassword(BCrypt.hashpw(req.password(), BCrypt.gensalt())); // FIXED
        repo.save(u);
    }

    public LoginResponse login(LoginRequest req) {
        User u = repo.findByEmail(req.email())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!BCrypt.checkpw(req.password(), u.getPassword())) { // FIXED
            throw new RuntimeException("Invalid credentials");
        }
        String token = jwtService.generateToken(u.getId(), u.getEmail());
        return new LoginResponse(token, u.getId(), u.getName(), u.getAge(), u.getEmail());
    }
}
