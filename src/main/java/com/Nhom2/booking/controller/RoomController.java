package com.Nhom2.booking.controller;

import com.Nhom2.booking.entity.Room;
import com.Nhom2.booking.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomService service;

    @GetMapping
    public List<Room> getAll() {
        return service.getAll();
    }

    @PostMapping
    public ResponseEntity<Room> create(@RequestBody Room entity) {
        return ResponseEntity.ok(service.save(entity));
    }
}

