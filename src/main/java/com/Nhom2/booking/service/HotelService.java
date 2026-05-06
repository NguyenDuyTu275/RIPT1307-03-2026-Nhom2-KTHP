package com.Nhom2.booking.service;

import com.Nhom2.booking.entity.Hotel;
import com.Nhom2.booking.repository.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class HotelService {

    @Autowired
    private HotelRepository repository;

    public List<Hotel> getAll() {
        return repository.findAll();
    }

    public Hotel save(Hotel entity) {
        return repository.save(entity);
    }
}

