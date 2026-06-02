package com.Nhom2.booking.controller;

import com.Nhom2.booking.dto.LoginRequest;
import com.Nhom2.booking.dto.RegisterRequest;
import com.Nhom2.booking.dto.VerifyOtpRequest;
import com.Nhom2.booking.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final com.Nhom2.booking.repository.UserRepository userRepository;

    public AuthController(UserService userService, com.Nhom2.booking.repository.UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @GetMapping("/debug/{username}")
    public ResponseEntity<?> debug(@PathVariable String username) {
        var user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            return ResponseEntity.ok(java.util.Map.of("exists", true, "passwordHash", user.get().getPassword()));
        }
        return ResponseEntity.ok(java.util.Map.of("exists", false));
    }

    // Đăng ký -> gửi OTP
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        try {
            return ResponseEntity.ok(userService.sendOtp(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Xác nhận OTP -> lưu user vào DB
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody VerifyOtpRequest request) {
        try {
            return ResponseEntity.ok(userService.verifyOtp(request.getEmail(), request.getOtp()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        try {
            return ResponseEntity.ok(userService.login(request));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}