package com.Nhom2.booking.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.Nhom2.booking.enums.*;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "booking_request")
@lombok.Data
@lombok.NoArgsConstructor
@lombok.AllArgsConstructor
public class BookingRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private RequestType type;

    private LocalDate newCheckIn;
    private LocalDate newCheckOut;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private LocalDateTime processedAt;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "processed_by")
    private User processedBy;
}