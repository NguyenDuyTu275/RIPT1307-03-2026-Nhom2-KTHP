package com.Nhom2.booking.service;

import com.Nhom2.booking.entity.Room;
import com.Nhom2.booking.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RoomService {

    @Autowired
    private RoomRepository repository;

    public List<Room> getAll() {
        return repository.findAll();
    }

    public Room save(Room entity) {
        return repository.save(entity);
    }
}

