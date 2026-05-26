package com.Nhom2.booking.repository;

import com.Nhom2.booking.entity.Room;
import com.Nhom2.booking.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByHotel(Hotel hotel);
}