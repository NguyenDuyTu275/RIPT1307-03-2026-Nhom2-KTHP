package com.Nhom2.booking.service;

import com.Nhom2.booking.dto.PaymentQrResponse;
import com.Nhom2.booking.dto.SepayWebhookRequest;
import com.Nhom2.booking.entity.Booking;
import com.Nhom2.booking.enums.BookingStatus;
import com.Nhom2.booking.enums.PaymentStatus;
import com.Nhom2.booking.repository.BookingRepository;
import com.Nhom2.booking.entity.User;
import com.Nhom2.booking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PaymentService {

    // TPBank BIN code theo chuẩn VietQR
    private static final String BANK_BIN = "970423";

    // Pattern để trích xuất booking ID từ nội dung chuyển khoản
    // Tìm "DH" theo sau bởi số, ví dụ: "DH 123", "DH123", "DH  123"
    private static final Pattern BOOKING_ID_PATTERN =
            Pattern.compile("DH\\s*(\\d+)", Pattern.CASE_INSENSITIVE);

    @Value("${payment.bank.name:TPBank}")
    private String bankName;

    @Value("${payment.bank.account-number:10001473192}")
    private String accountNumber;

    @Value("${payment.bank.account-name:NGUYEN DUY TU}")
    private String accountName;

    @Value("${payment.qr.template:compact2}")
    private String qrTemplate;

    @Value("${payment.sepay.api-key:}")
    private String sepayApiKey;

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

    /**
     * Tạo mã QR thanh toán cho booking
     * Sử dụng VietQR API (miễn phí, không cần đăng ký)
     */
    public PaymentQrResponse generatePaymentQr(Long bookingId) {

        User user = getCurrentUser();
        Booking booking = getBooking(bookingId);

        // Chỉ chủ booking mới được xem QR
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

        // Nội dung chuyển khoản: DH {bookingId}
        String transferContent = "DH " + bookingId;
        long amount = booking.getTotalPrice().longValue();

        // Tạo URL mã QR theo VietQR API
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

    // ==================== SEPAY WEBHOOK ====================

    /**
     * Xác thực API key từ Sepay webhook.
     * API key được cấu hình trong Sepay Dashboard và application.properties.
     */
    public boolean verifySepayApiKey(String authorization) {
        // Nếu chưa cấu hình API key → bỏ qua xác thực (dev mode)
        if (sepayApiKey == null || sepayApiKey.isBlank()) {
            System.out.println("[Webhook] WARNING: No Sepay API key configured, skipping auth check");
            return true;
        }

        if (authorization == null || authorization.isBlank()) {
            System.out.println("[Webhook] ERROR: Missing Authorization header");
            return false;
        }

        // Sepay gửi header: "Bearer <api_key>"
        String token = authorization.replace("Bearer ", "").trim();
        boolean valid = sepayApiKey.equals(token);

        if (!valid) {
            System.out.println("[Webhook] ERROR: Invalid API key");
        }

        return valid;
    }

    /**
     * Xử lý webhook từ Sepay:
     * 1. Parse nội dung chuyển khoản → tìm booking ID
     * 2. Kiểm tra số tiền khớp
     * 3. Tự động cập nhật paymentStatus = PAID
     * 4. Gửi thông báo cho user
     *
     * @return true nếu tìm thấy và xử lý booking thành công
     */
    @Transactional
    public boolean processWebhookPayment(SepayWebhookRequest request) {
        // Chỉ xử lý giao dịch tiền VÀO (transferType = "in")
        if (!"in".equalsIgnoreCase(request.getTransferType())) {
            System.out.println("[Webhook] Skipped: not an incoming transfer");
            return false;
        }

        String content = request.getContent();
        if (content == null || content.isBlank()) {
            System.out.println("[Webhook] Skipped: empty transfer content");
            return false;
        }

        System.out.println("[Webhook] Received transaction: amount="
                + request.getTransferAmount()
                + ", content=\"" + content + "\"");

        // Trích xuất booking ID từ nội dung: "DH 123" → 123
        Long bookingId = extractBookingId(content);
        if (bookingId == null) {
            System.out.println("[Webhook] Skipped: no booking ID found in content");
            return false;
        }

        // Tìm booking
        Optional<Booking> optionalBooking = bookingRepository.findById(bookingId);
        if (optionalBooking.isEmpty()) {
            System.out.println("[Webhook] Skipped: booking #" + bookingId + " not found");
            return false;
        }

        Booking booking = optionalBooking.get();

        // Kiểm tra booking đã CONFIRMED và chưa PAID
        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            System.out.println("[Webhook] Skipped: booking #" + bookingId
                    + " status is " + booking.getStatus() + " (need CONFIRMED)");
            return false;
        }

        if (booking.getPaymentStatus() == PaymentStatus.PAID) {
            System.out.println("[Webhook] Skipped: booking #" + bookingId + " already paid");
            return false;
        }

        // Kiểm tra số tiền (cho phép >= totalPrice để tránh sai lệch nhỏ)
        long expectedAmount = booking.getTotalPrice().longValue();
        long receivedAmount = request.getTransferAmount() != null
                ? request.getTransferAmount() : 0;

        if (receivedAmount < expectedAmount) {
            System.out.println("[Webhook] WARNING: booking #" + bookingId
                    + " received " + receivedAmount
                    + " but expected " + expectedAmount);

            // Vẫn thông báo admin để xử lý thủ công
            notificationService.notifyAdmins(
                    "⚠️ Insufficient payment",
                    "Booking #" + bookingId
                            + " received " + String.format("%,d", receivedAmount) + " VND"
                            + " but expected " + String.format("%,d", expectedAmount) + " VND."
                            + " Please verify manually."
            );
            return false;
        }

        // ✅ TỰ ĐỘNG XÁC NHẬN THANH TOÁN
        booking.setPaymentStatus(PaymentStatus.PAID);
        bookingRepository.save(booking);

        System.out.println("[Webhook] ✅ Booking #" + bookingId
                + " auto-confirmed PAID (received: "
                + receivedAmount + " VND)");

        // Thông báo cho user
        notificationService.create(
                booking.getUser(),
                "✅ Payment confirmed",
                "Your payment of " + String.format("%,d", receivedAmount)
                        + " VND for booking #" + bookingId
                        + " has been automatically confirmed. Thank you!"
        );

        // Thông báo cho admin
        notificationService.notifyAdmins(
                "✅ Auto payment confirmed",
                "Booking #" + bookingId
                        + " payment auto-confirmed via bank transfer."
                        + " Amount: " + String.format("%,d", receivedAmount) + " VND."
        );

        return true;
    }

    /**
     * Trích xuất booking ID từ nội dung chuyển khoản.
     * Hỗ trợ: "DH 123", "DH123", "thanh toan DH 123 abc", ...
     */
    private Long extractBookingId(String content) {
        Matcher matcher = BOOKING_ID_PATTERN.matcher(content);
        if (matcher.find()) {
            try {
                return Long.parseLong(matcher.group(1));
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
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
