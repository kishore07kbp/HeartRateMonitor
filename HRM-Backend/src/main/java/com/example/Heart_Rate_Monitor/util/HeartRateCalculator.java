package com.example.Heart_Rate_Monitor.util;

public class HeartRateCalculator {

    public static int maxHr(int age) {
        return 220 - age;
    }

    public static int targetLower(int age) {
        return Math.round(maxHr(age) * 0.5f);
    }

    public static int targetUpper(int age) {
        return Math.round(maxHr(age) * 0.85f);
    }
}
