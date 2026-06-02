package com.Nhom2.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentQrResponse {

    private Long bookingId;
    private String qrCodeUrl;
    private String bankName;
    private String accountNumber;
    private String accountName;
    private Double amount;
    private String transferContent;
}
