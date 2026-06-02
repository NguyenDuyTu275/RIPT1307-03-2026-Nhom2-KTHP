package com.Nhom2.booking.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "room_image")
@lombok.Data
@lombok.NoArgsConstructor
@lombok.AllArgsConstructor
public class RoomImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "room_id")
    @JsonIgnore
    private Room room;
}

