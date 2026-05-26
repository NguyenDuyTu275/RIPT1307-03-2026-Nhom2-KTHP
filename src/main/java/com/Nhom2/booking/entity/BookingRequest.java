package com.Nhom2.booking.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.Nhom2.booking.enums.*;
import org.hibernate.annotations.CreationTimestamp;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private LocalDateTime processedAt;

    @Column(columnDefinition = "TEXT")
    private String adminResponse;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    @JsonIgnoreProperties({"bookingRooms"})
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "processed_by")
    @JsonIgnoreProperties({"password", "bookings"})
    private User processedBy;
}
