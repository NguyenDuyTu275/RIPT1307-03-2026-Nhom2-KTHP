package com.Nhom2.booking.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;

@Service
public class OtpService {

    private final Map<String, String> otpStorage = new HashMap<>();
    private final SecureRandom random = new SecureRandom();

    public String generateOtp(String email) {
        String otp = String.format("%06d", random.nextInt(1000000));
        otpStorage.put(email, otp);
        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        return otp.equals(otpStorage.get(email));
    }

    public void removeOtp(String email) {
        otpStorage.remove(email);
    }
}