package com.Nhom2.booking.entity;



import jakarta.persistence.*;

@Entity
@Table(name = "room_image")
public class RoomImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;
}
