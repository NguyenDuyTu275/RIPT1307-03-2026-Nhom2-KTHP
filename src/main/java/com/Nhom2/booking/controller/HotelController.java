package com.Nhom2.booking.controller;

import com.Nhom2.booking.entity.Hotel;
import com.Nhom2.booking.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
public class HotelController {

    @Autowired
    private HotelService service;

    @GetMapping
    public List<Hotel> getAll() {
        return service.getAll();
    }

    @PostMapping
    public ResponseEntity<Hotel> create(@RequestBody Hotel entity) {
        return ResponseEntity.ok(service.save(entity));
    }
}

