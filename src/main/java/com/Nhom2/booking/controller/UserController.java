package com.Nhom2.booking.controller;

import com.Nhom2.booking.entity.User;
import com.Nhom2.booking.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(
            UserService userService
    ) {
        this.userService = userService;
    }

    // GET ALL
    @GetMapping
    public List<User> getAll() {

        return userService.getAll();
    }

    // CREATE USER
    @PostMapping
    public User create(
            @RequestBody User user
    ) {

        return userService.create(user);
    }

    // DELETE USER
    @DeleteMapping("/{id}")
    public String delete(
            @PathVariable Long id
    ) {

        userService.delete(id);

        return "Deleted success";
    }

    // UPDATE USER
    @PutMapping("/{id}")
    public User update(
            @PathVariable Long id,
            @RequestBody User user
    ) {

        user.setId(id);

        return userService.create(user);
    }
}