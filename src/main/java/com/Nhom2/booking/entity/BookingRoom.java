package com.Nhom2.booking.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "booking_rooms")
@lombok.Data
@lombok.NoArgsConstructor
@lombok.AllArgsConstructor
public class BookingRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer quantity;
    private Double price;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;
}
