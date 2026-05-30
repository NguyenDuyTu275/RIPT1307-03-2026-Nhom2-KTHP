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

    private static final int MIN_PASSWORD_LENGTH = 8;
    private static final int MAX_PASSWORD_LENGTH = 72;
    private static final String PASSWORD_POLICY_MESSAGE =
            "Mật khẩu phải chứ từ 8-72 ký tự bào gồm chữ hoa, chữ thường, số , ký tự đặc biệt và không có khoảng trống.";

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
        User existingUser = null;

        if (user.getId() != null) {
            existingUser = userRepository.findById(user.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        if (user.getRole() == null) {
            user.setRole(existingUser != null && existingUser.getRole() != null
                    ? existingUser.getRole()
                    : UserRole.USER);
        }

        if (isBlank(user.getPassword())) {
            if (existingUser == null) {
                throw new RuntimeException(PASSWORD_POLICY_MESSAGE);
            }
            user.setPassword(existingUser.getPassword());
        } else if (!isBcrypt(user.getPassword())) {
            validatePasswordStrength(user.getPassword(), user.getUsername(), user.getEmail());
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

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private void validatePasswordStrength(String password, String username, String email) {
        if (password.length() < MIN_PASSWORD_LENGTH || password.length() > MAX_PASSWORD_LENGTH) {
            throw new RuntimeException(PASSWORD_POLICY_MESSAGE);
        }
        if (password.contains(" ")) {
            throw new RuntimeException(PASSWORD_POLICY_MESSAGE);
        }
        boolean hasUpper = false, hasLower = false, hasDigit = false, hasSpecial = false;
        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) hasUpper = true;
            else if (Character.isLowerCase(c)) hasLower = true;
            else if (Character.isDigit(c)) hasDigit = true;
            else hasSpecial = true;
        }
        if (!hasUpper || !hasLower || !hasDigit || !hasSpecial) {
            throw new RuntimeException(PASSWORD_POLICY_MESSAGE);
        }
    }
}
