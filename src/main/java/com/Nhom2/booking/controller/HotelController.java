package com.Nhom2.booking.controller;

import com.Nhom2.booking.entity.Hotel;
import com.Nhom2.booking.service.HotelService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/hotels")
public class HotelController {

    private final HotelService hotelService;

    public HotelController(HotelService hotelService) {
        this.hotelService = hotelService;
    }

    @GetMapping
    public List<Hotel> getAll() {
        return hotelService.getAll();
    }

    @GetMapping("/{id}")
    public Optional<Hotel> getById(@PathVariable Long id) {
        return hotelService.getById(id);
    }

    @PostMapping
    public Hotel create(@RequestBody Hotel hotel) {
        return hotelService.save(hotel);
    }

    @PutMapping("/{id}")
    public Hotel update(@PathVariable Long id, @RequestBody Hotel hotel) {
        hotel.setId(id);
        return hotelService.save(hotel);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        hotelService.delete(id);
        return "Deleted hotel";
    }
}