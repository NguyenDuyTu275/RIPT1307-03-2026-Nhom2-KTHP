package com.Nhom2.booking.service;

import com.Nhom2.booking.dto.PaymentQrResponse;
import com.Nhom2.booking.entity.Booking;
import com.Nhom2.booking.enums.BookingStatus;
import com.Nhom2.booking.enums.PaymentStatus;
import com.Nhom2.booking.repository.BookingRepository;
import com.Nhom2.booking.entity.User;
import com.Nhom2.booking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class PaymentService {


    private static final String BANK_BIN = "970423";

    @Value("${payment.bank.name:TPBank}")
    private String bankName;

    @Value("${payment.bank.account-number:10001473192}")
    private String accountNumber;

    @Value("${payment.bank.account-name:NGUYEN DUY TU}")
    private String accountName;

    @Value("${payment.qr.template:compact2}")
    private String qrTemplate;

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public PaymentService(
            BookingRepository bookingRepository,
            UserRepository userRepository,
            NotificationService notificationService
    ) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }


    public PaymentQrResponse generatePaymentQr(Long bookingId) {

        User user = getCurrentUser();
        Booking booking = getBooking(bookingId);


        if (!booking.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only access your own booking");
        }

        // Chỉ booking CONFIRMED + UNPAID mới được thanh toán
        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new RuntimeException(
                    "Booking must be confirmed before payment. Current status: "
                            + booking.getStatus()
            );
        }

        if (booking.getPaymentStatus() == PaymentStatus.PAID) {
            throw new RuntimeException("Booking has already been paid");
        }


        String transferContent = "DH " + bookingId;
        long amount = booking.getTotalPrice().longValue();


        String qrCodeUrl = String.format(
                "https://img.vietqr.io/image/%s-%s-%s.png?amount=%d&addInfo=%s&accountName=%s",
                BANK_BIN,
                accountNumber,
                qrTemplate,
                amount,
                URLEncoder.encode(transferContent, StandardCharsets.UTF_8),
                URLEncoder.encode(accountName, StandardCharsets.UTF_8)
        );

        PaymentQrResponse response = new PaymentQrResponse();
        response.setBookingId(bookingId);
        response.setQrCodeUrl(qrCodeUrl);
        response.setBankName(bankName);
        response.setAccountNumber(accountNumber);
        response.setAccountName(accountName);
        response.setAmount(booking.getTotalPrice());
        response.setTransferContent(transferContent);

        return response;
    }

    /**
     * User xác nhận đã thanh toán → thông báo cho admin
     */
    public Booking confirmPaymentByUser(Long bookingId) {

        User user = getCurrentUser();
        Booking booking = getBooking(bookingId);

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only access your own booking");
        }

        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new RuntimeException("Booking must be confirmed before payment");
        }

        if (booking.getPaymentStatus() == PaymentStatus.PAID) {
            throw new RuntimeException("Booking has already been paid");
        }

        // Thông báo cho admin kiểm tra thanh toán
        notificationService.notifyAdmins(
                "Payment notification",
                "User " + user.getUsername()
                        + " has transferred payment for booking #" + bookingId
                        + ". Amount: " + String.format("%,.0f", booking.getTotalPrice())
                        + " VND. Please verify and confirm."
        );

        return booking;
    }

    private Booking getBooking(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
