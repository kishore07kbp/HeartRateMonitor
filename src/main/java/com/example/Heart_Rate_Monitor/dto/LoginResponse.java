package com.example.Heart_Rate_Monitor.dto;

public record LoginResponse(
        String token,
        Long userId,
        String name,
        int age,
        String email
) {}
