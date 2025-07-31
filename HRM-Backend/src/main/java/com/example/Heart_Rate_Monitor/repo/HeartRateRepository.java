package com.example.Heart_Rate_Monitor.repo;

import com.example.Heart_Rate_Monitor.model.HeartRate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HeartRateRepository extends JpaRepository<HeartRate, Long> {
    // Works with @ManyToOne User user;
    List<HeartRate> findByUser_IdOrderByTimestampDesc(Long userId);
}
