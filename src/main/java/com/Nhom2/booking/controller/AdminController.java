package com.Nhom2.booking.controller;

import com.Nhom2.booking.dto.ProcessBookingRequestDto;
import com.Nhom2.booking.entity.Booking;
import com.Nhom2.booking.enums.BookingStatus;
import com.Nhom2.booking.enums.RequestStatus;
import com.Nhom2.booking.service.BookingService;
import com.Nhom2.booking.service.ReportService;
import com.Nhom2.booking.service.StatisticsService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final BookingService bookingService;
    private final StatisticsService statisticsService;
    private final ReportService reportService;

    public AdminController(
            BookingService bookingService,
            StatisticsService statisticsService,
            ReportService reportService
    ) {
        this.bookingService = bookingService;
        this.statisticsService = statisticsService;
        this.reportService = reportService;
    }

    @GetMapping("/bookings")
    public List<Booking> getBookings(
            @RequestParam(required = false) BookingStatus status
    ) {
        return bookingService.getBookings(status);
    }

    @PutMapping("/bookings/{bookingId}/approve")
    public Booking approveBooking(@PathVariable Long bookingId) {
        return bookingService.approveBooking(bookingId);
    }

    @PutMapping("/bookings/{bookingId}/reject")
    public Booking rejectBooking(
            @PathVariable Long bookingId,
            @RequestBody(required = false) ProcessBookingRequestDto request
    ) {
        return bookingService.rejectBooking(
                bookingId,
                getResponse(request)
        );
    }

    @PutMapping("/bookings/{bookingId}/paid")
    public Booking markBookingPaid(@PathVariable Long bookingId) {
        return bookingService.markBookingPaid(bookingId);
    }

    @GetMapping("/booking-requests")
    public List<com.Nhom2.booking.entity.BookingRequest> getBookingRequests(
            @RequestParam(required = false) RequestStatus status
    ) {
        return bookingService.getBookingRequests(status);
    }

    @PutMapping("/booking-requests/{requestId}/approve")
    public com.Nhom2.booking.entity.BookingRequest approveBookingRequest(
            @PathVariable Long requestId,
            @RequestBody(required = false) ProcessBookingRequestDto request
    ) {
        return bookingService.approveBookingRequest(
                requestId,
                getResponse(request)
        );
    }

    @PutMapping("/booking-requests/{requestId}/reject")
    public com.Nhom2.booking.entity.BookingRequest rejectBookingRequest(
            @PathVariable Long requestId,
            @RequestBody(required = false) ProcessBookingRequestDto request
    ) {
        return bookingService.rejectBookingRequest(
                requestId,
                getResponse(request)
        );
    }

    @GetMapping("/statistics/overview")
    public Map<String, Object> getOverview() {
        return statisticsService.getOverview();
    }

    @GetMapping("/reports/bookings.xlsx")
    public ResponseEntity<byte[]> exportBookings() {
        byte[] data = reportService.exportBookingsExcel();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=bookings.xlsx"
                )
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        )
                )
                .body(data);
    }

    private String getResponse(ProcessBookingRequestDto request) {
        return request == null ? null : request.getResponse();
    }
}
