package com.example.Heart_Rate_Monitor.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record HeartRateRequest(
        @NotNull @Min(1) Integer bpm
) {}
