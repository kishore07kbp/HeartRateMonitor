package com.example.Heart_Rate_Monitor.controller;

import com.example.Heart_Rate_Monitor.dto.HeartRateRequest;
import com.example.Heart_Rate_Monitor.dto.HeartRateResponse;
import com.example.Heart_Rate_Monitor.model.HeartRate;
import com.example.Heart_Rate_Monitor.model.User;
import com.example.Heart_Rate_Monitor.repo.HeartRateRepository;
import com.example.Heart_Rate_Monitor.util.HeartRateCalculator;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/rates")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class HeartRateController {

    private final HeartRateRepository heartRateRepository;

    public HeartRateController(HeartRateRepository heartRateRepository) {
        this.heartRateRepository = heartRateRepository;
    }

    /**
     * Save a heart-rate value for the currently authenticated user.
     */
    @PostMapping
    public HeartRateResponse addRate(@AuthenticationPrincipal User user,
                                     @RequestBody @Valid HeartRateRequest req) {
        HeartRate hr = new HeartRate();
        hr.setUser(user);                      // <-- set the User entity, not userId
        hr.setBpm(req.bpm());
        hr.setTimestamp(LocalDateTime.now());

        heartRateRepository.save(hr);

        return new HeartRateResponse(hr.getId(), hr.getBpm(), hr.getTimestamp());
    }

    /**
     * Return all heart-rate entries for the authenticated user (latest first).
     */
    @GetMapping
    public List<HeartRateResponse> list(@AuthenticationPrincipal User user) {
        return heartRateRepository.findByUser_IdOrderByTimestampDesc(user.getId())
                .stream()
                .map(h -> new HeartRateResponse(h.getId(), h.getBpm(), h.getTimestamp()))
                .toList();
    }

    /**
     * Return stats (min, max, target zone) for the authenticated user.
     */
    @GetMapping("/stats")
    public Map<String, Object> stats(@AuthenticationPrincipal User user) {
        var list = heartRateRepository.findByUser_IdOrderByTimestampDesc(user.getId());

        OptionalInt min = list.stream().mapToInt(HeartRate::getBpm).min();
        OptionalInt max = list.stream().mapToInt(HeartRate::getBpm).max();

        int maxHr = HeartRateCalculator.maxHr(user.getAge());

        Map<String, Object> m = new HashMap<>();
        m.put("min", min.isPresent() ? min.getAsInt() : null);
        m.put("max", max.isPresent() ? max.getAsInt() : null);
        m.put("maxHr", maxHr);
        m.put("targetLower", HeartRateCalculator.targetLower(user.getAge()));
        m.put("targetUpper", HeartRateCalculator.targetUpper(user.getAge()));
        return m;
    }
}
