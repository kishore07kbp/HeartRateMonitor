package com.example.Heart_Rate_Monitor.dto;

import jakarta.validation.constraints.*;

public record SignupRequest(
        @NotBlank String name,
        @Min(1) @Max(120) int age,
        @Email @NotBlank String email,
        @NotBlank String password
) {}
