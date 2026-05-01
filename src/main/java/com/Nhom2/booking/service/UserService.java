package com.Nhom2.booking.service;

import com.Nhom2.booking.entity.User;
import com.Nhom2.booking.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public User create(User users) {
        return userRepository.save(users);
    }

    public void delete(Long id) {
        userRepository.deleteById(id);
    }
    public User update(Long id, User user) {
        user.setId(id);
        return userRepository.save(user);
    }
    public List<User> searchByName(String name) {
        return userRepository.findByName(name);
    }
}