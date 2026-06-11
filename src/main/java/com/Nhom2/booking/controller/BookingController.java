package com.Nhom2.booking.controller;

import com.Nhom2.booking.dto.BookingRequest;
import com.Nhom2.booking.dto.CreateBookingRequestDto;
import com.Nhom2.booking.entity.Booking;
import com.Nhom2.booking.service.BookingService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(
            BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // user đặt phòng
    @PostMapping("/{hotelId}")
    public Booking createBooking(
            @PathVariable Long hotelId,
            @RequestBody BookingRequest request,
            Authentication authentication) {

        return bookingService.createBooking(
                authentication.getName(),
                hotelId,
                request);
    }

    // xem booking của chính mình
    @GetMapping("/my")
    public List<Booking> myBookings() {
        return bookingService.getMyBookings();
    }

    // huỷ booking
    @PutMapping("/cancel/{bookingId}")
    public Booking cancelBooking(
            @PathVariable Long bookingId) {
        return bookingService.cancelBooking(bookingId);
    }

    @PostMapping("/{bookingId}/requests")
    public com.Nhom2.booking.entity.BookingRequest createRequest(
            @PathVariable Long bookingId,
            @RequestBody CreateBookingRequestDto request,
            Authentication authentication) {
        return bookingService.createBookingRequest(
                authentication.getName(),
                bookingId,
                request);
    }

    @GetMapping("/{bookingId}/requests")
    public List<com.Nhom2.booking.entity.BookingRequest> getRequests(
            @PathVariable Long bookingId,
            Authentication authentication) {
        return bookingService.getMyBookingRequests(
                authentication.getName(),
                bookingId);
    }
}
