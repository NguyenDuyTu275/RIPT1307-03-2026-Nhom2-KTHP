package com.Nhom2.booking.controller;

import com.Nhom2.booking.entity.User;
import com.Nhom2.booking.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // GET all
    @GetMapping
    public List<User> getAll() {
        return userService.getAll();
    }

    // POST create
    @PostMapping
    public User create(@RequestBody User user) {
        return userService.create(user);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }
    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        return userService.create(user);
    }


}