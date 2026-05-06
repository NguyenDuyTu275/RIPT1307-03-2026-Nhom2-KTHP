package com.Nhom2.booking.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "users")
@lombok.Data
@lombok.NoArgsConstructor
@lombok.AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;
    private String email;
    private String name;


    @OneToMany(mappedBy = "user")
    private List<Booking> bookings;
}
