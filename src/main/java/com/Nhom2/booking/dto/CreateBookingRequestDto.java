package com.Nhom2.booking.dto;

import com.Nhom2.booking.enums.RequestType;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateBookingRequestDto {

    private RequestType type;
    private LocalDate newCheckIn;
    private LocalDate newCheckOut;
    private String reason;
}
