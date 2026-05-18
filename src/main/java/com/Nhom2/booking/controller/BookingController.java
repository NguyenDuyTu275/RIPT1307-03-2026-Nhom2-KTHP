package com.Nhom2.booking.controller;

import com.Nhom2.booking.entity.Booking;
import com.Nhom2.booking.service.BookingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(
            BookingService bookingService
    ) {
        this.bookingService = bookingService;
    }

    // user đặt phòng
    @PostMapping("/{hotelId}")
    public Booking createBooking(
            @PathVariable Long hotelId,
            @RequestBody Booking booking
    ) {
        return bookingService.createBooking(hotelId, booking);
    }

    // xem booking của chính mình
    @GetMapping("/my")
    public List<Booking> myBookings() {
        return bookingService.getMyBookings();
    }

    // huỷ booking
    @PutMapping("/cancel/{bookingId}")
    public Booking cancelBooking(
            @PathVariable Long bookingId
    ) {
        return bookingService.cancelBooking(bookingId);
    }
}