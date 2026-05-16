package com.Nhom2.booking.service;

import com.Nhom2.booking.dto.LoginRequest;
import com.Nhom2.booking.dto.RegisterRequest;
import com.Nhom2.booking.entity.User;
import com.Nhom2.booking.enums.UserRole;
import com.Nhom2.booking.repository.UserRepository;
import com.Nhom2.booking.security.JwtUtil;
import org.springframework.stereotype.Service;
//import com.Nhom2.booking.dto.RegisterRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final Map<String, RegisterRequest> pendingUsers = new HashMap<>();
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final MailService mailService;

//    @Autowired
//    private OtpService otpService;
//
//    @Autowired
//    private MailService mailService;

    public UserService(
            UserRepository userRepository,
            JwtUtil jwtUtil,
            MailService mailService
    ) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.mailService = mailService;
    }
    // gửi otp
//    public String sendOtp(RegisterRequest request) {
//
//        if (userRepository.findByusername(request.getUsername()).isPresent()) {
//            return "Username đã tồn tại";
//        }
//
//        String otp = otpService.generateOtp(request.getEmail());
//
//        pendingUsers.put(request.getEmail(), request);
//
//        mailService.sendMail(
//                request.getEmail(),
//                "Xác nhận đăng ký tài khoản",
//                "Mã OTP của bạn là: " + otp
//        );
//
//        return "Đã gửi OTP về email";
//    }
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
        return userRepository.save(user);
    }

    // DELETE
    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    // REGISTER
    public String register(RegisterRequest request) {

        if (userRepository.findByusername(request.getUsername()).isPresent()) {
            return "Username already exists";
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setEmail(request.getEmail());
        user.setRole(UserRole.USER);

        userRepository.save(user);

        // gửi mail đăng ký
        mailService.sendMail(
                user.getEmail(),
                "Đăng ký thành công",
                "Xin chào " + user.getUsername() + ", bạn đã đăng ký tài khoản thành công."
        );

        return "Register success";
    }

    // LOGIN
    public String login(LoginRequest request) {

        User user = userRepository.findByusername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Wrong password");
        }

        // gửi mail đăng nhập
        mailService.sendMail(
                user.getEmail(),
                "Đăng nhập thành công",
                "Xin chào " + user.getUsername() + ", bạn vừa đăng nhập vào hệ thống."
        );

        return jwtUtil.generateToken(user.getUsername());
    }
}