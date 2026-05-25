package com.Nhom2.booking.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class BookingRequest {

    private LocalDate checkInDate;
    private LocalDate checkOutDate;

    private List<BookingRoomRequest> rooms;
}