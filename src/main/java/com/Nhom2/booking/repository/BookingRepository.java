package com.Nhom2.booking.repository;

import com.Nhom2.booking.entity.Booking;
import com.Nhom2.booking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
}