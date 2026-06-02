package com.Nhom2.booking.service;

import com.Nhom2.booking.entity.Hotel;
import com.Nhom2.booking.repository.HotelRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class HotelService {

    private final HotelRepository hotelRepository;

    public HotelService(HotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    @Transactional(readOnly = true)
    public List<Hotel> getAll() {
        return hotelRepository.findAllWithRoomsAndImages();
    }

    @Transactional(readOnly = true)
    public Optional<Hotel> getById(Long id) {
        return hotelRepository.findByIdWithRoomsAndImages(id);
    }

    @Transactional
    public Hotel save(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    @Transactional
    public void delete(Long id) {
        hotelRepository.deleteById(id);
    }
}