package com.Nhom2.booking.service;

import com.Nhom2.booking.entity.Booking;
import com.Nhom2.booking.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository repository;

    public List<Booking> getAll() {
        return repository.findAll();
    }

    public Booking save(Booking entity) {
        return repository.save(entity);
    }
}

