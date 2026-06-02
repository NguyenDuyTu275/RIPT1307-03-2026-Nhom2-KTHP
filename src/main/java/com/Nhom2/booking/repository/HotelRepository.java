package com.Nhom2.booking.repository;

import com.Nhom2.booking.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface HotelRepository extends JpaRepository<Hotel, Long> {

    @Query("SELECT DISTINCT h FROM Hotel h LEFT JOIN FETCH h.rooms r LEFT JOIN FETCH r.images")
    List<Hotel> findAllWithRoomsAndImages();

    @Query("SELECT DISTINCT h FROM Hotel h LEFT JOIN FETCH h.rooms r LEFT JOIN FETCH r.images WHERE h.id = :id")
    Optional<Hotel> findByIdWithRoomsAndImages(@Param("id") Long id);
}