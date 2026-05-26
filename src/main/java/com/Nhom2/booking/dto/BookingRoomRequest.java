package com.Nhom2.booking.dto;

import lombok.Data;

@Data
public class BookingRoomRequest {

    private Long roomId;
    private Integer quantity;
}