package com.Nhom2.booking.controller;

import com.Nhom2.booking.dto.PaymentQrResponse;
import com.Nhom2.booking.entity.Booking;
import com.Nhom2.booking.service.PaymentService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bookings")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }


    @GetMapping("/{bookingId}/payment-qr")
    public PaymentQrResponse getPaymentQr(@PathVariable Long bookingId) {
        return paymentService.generatePaymentQr(bookingId);
    }


    @PostMapping("/{bookingId}/confirm-payment")
    public Booking confirmPayment(@PathVariable Long bookingId) {
        return paymentService.confirmPaymentByUser(bookingId);
    }
}
