package com.Nhom2.booking.service;

import com.Nhom2.booking.dto.LoginRequest;
import com.Nhom2.booking.dto.RegisterRequest;
import com.Nhom2.booking.entity.User;
import com.Nhom2.booking.enums.UserRole;
import com.Nhom2.booking.repository.UserRepository;
import com.Nhom2.booking.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    private final Map<String, RegisterRequest> pendingUsers = new HashMap<>();
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final MailService mailService;
    private final OtpService otpService;
    private final PasswordEncoder passwordEncoder;


    public UserService(
            UserRepository userRepository,
            JwtUtil jwtUtil,
            MailService mailService,
            OtpService otpService,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.mailService = mailService;
        this.otpService = otpService;
        this.passwordEncoder = passwordEncoder;
    }

    // GET ALL
    public List<User> getAll() {
        return userRepository.findAll();
    }

    // GET ONE
    public Optional<User> getUser(Long id) {
        return userRepository.findById(id);
    }

    // CREATE / UPDATE
    public User create(User user) {
        if (user.getRole() == null) {
            user.setRole(UserRole.USER);
        }
        if (user.getPassword() != null && !isBcrypt(user.getPassword())) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return userRepository.save(user);
    }

    // DELETE
    public void delete(Long id) {
        userRepository.deleteById(id);
    }
    //sendotp


    public String sendOtp(RegisterRequest request) {

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return "Username already exists";
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return "Email already exists";
        }

        String otp = otpService.generateOtp(request.getEmail());

        pendingUsers.put(request.getEmail(), request);

        mailService.sendMail(
                request.getEmail(),
                "Xác nhận đăng ký tài khoản",
                "Mã OTP của bạn là: " + otp
        );

        return "OTP sent to email";
    }
    //verify otp
    public String verifyOtp(String email, String otp) {

        if (!otpService.verifyOtp(email, otp)) {
            return "OTP invalid";
        }

        RegisterRequest request = pendingUsers.get(email);

        if (request == null) {
            return "No registration request found";
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setRole(UserRole.USER);

        userRepository.save(user);

        otpService.removeOtp(email);
        pendingUsers.remove(email);

        return "Register success";
    }


    // LOGIN
    public String login(LoginRequest request) {

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == null) {
            user.setRole(UserRole.USER);
            userRepository.save(user);
        }

        if (!passwordMatches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Wrong password");
        }
        if (!isBcrypt(user.getPassword())) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            userRepository.save(user);
        }

        // gửi mail đăng nhập
        mailService.sendMail(
                user.getEmail(),
                "Đăng nhập thành công",
                "Xin chào " + user.getUsername() + ", bạn vừa đăng nhập vào hệ thống."
        );

        return jwtUtil.generateToken(user.getUsername(), user.getRole());
    }

    private boolean passwordMatches(String rawPassword, String storedPassword) {
        if (isBcrypt(storedPassword)) {
            return passwordEncoder.matches(rawPassword, storedPassword);
        }
        return storedPassword != null && storedPassword.equals(rawPassword);
    }

    private boolean isBcrypt(String password) {
        return password != null && password.startsWith("$2");
    }
}
