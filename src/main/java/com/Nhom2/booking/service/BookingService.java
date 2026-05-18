package com.Nhom2.booking.service;

import com.Nhom2.booking.entity.Booking;
import com.Nhom2.booking.entity.Hotel;
import com.Nhom2.booking.entity.User;
import com.Nhom2.booking.enums.BookingStatus;
import com.Nhom2.booking.enums.PaymentStatus;
import com.Nhom2.booking.repository.BookingRepository;
import com.Nhom2.booking.repository.HotelRepository;
import com.Nhom2.booking.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;

    public BookingService(
            BookingRepository bookingRepository,
            UserRepository userRepository,
            HotelRepository hotelRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.hotelRepository = hotelRepository;
    }

    // đặt phòng
    public Booking createBooking(Long hotelId, Booking bookingRequest) {

        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByusername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        bookingRequest.setUser(user);
        bookingRequest.setHotel(hotel);

        bookingRequest.setStatus(BookingStatus.PENDING);
        bookingRequest.setPaymentStatus(PaymentStatus.UNPAID);

        return bookingRepository.save(bookingRequest);
    }

    // lịch sử đặt phòng của user
    public List<Booking> getMyBookings() {

        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByusername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return bookingRepository.findByUser(user);
    }

    // huỷ booking
    public Booking cancelBooking(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(BookingStatus.CANCELLED);

        return bookingRepository.save(booking);
    }
}