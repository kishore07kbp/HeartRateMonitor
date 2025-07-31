package com.example.Heart_Rate_Monitor.dto;

import java.time.LocalDateTime;

public record HeartRateResponse(Long id, int bpm, LocalDateTime timestamp) {}
