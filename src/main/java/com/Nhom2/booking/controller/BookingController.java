package com.Nhom2.booking.controller;

import com.Nhom2.booking.entity.Booking;
import com.Nhom2.booking.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService service;

    @GetMapping
    public List<Booking> getAll() {
        return service.getAll();
    }

    @PostMapping
    public ResponseEntity<Booking> create(@RequestBody Booking entity) {
        return ResponseEntity.ok(service.save(entity));
    }
}

