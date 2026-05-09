package com.Nhom2.booking.service;

import com.Nhom2.booking.dto.LoginRequest;
import com.Nhom2.booking.dto.RegisterRequest;
import com.Nhom2.booking.entity.User;
import com.Nhom2.booking.enums.UserRole;
import com.Nhom2.booking.repository.UserRepository;
import com.Nhom2.booking.security.JwtUtil;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public UserService(
            UserRepository userRepository,
            JwtUtil jwtUtil
    ) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    // GET ALL
    public List<User> getAll() {

        return userRepository.findAll();
    }
    // GET
    public Optional<User> getUser(Long id ){
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

        if(userRepository.findByusername(
                request.getUsername()
        ).isPresent()) {

            return "Username already exists";
        }

        User user = new User();

        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setEmail(request.getEmail());
        user.setRole(UserRole.USER);

        userRepository.save(user);

        return "Register success";
    }

    // LOGIN
    public String login(LoginRequest request) {

        User user = userRepository.findByusername(
                request.getUsername()
        ).orElseThrow(() ->
                new RuntimeException("User not found")
        );

        if(!user.getPassword()
                .equals(request.getPassword())) {

            throw new RuntimeException("Wrong password");
        }

        return jwtUtil.generateToken(
                user.getUsername()
        );
    }
}