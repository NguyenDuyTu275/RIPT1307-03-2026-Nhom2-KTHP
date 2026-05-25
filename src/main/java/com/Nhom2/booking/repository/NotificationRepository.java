package com.Nhom2.booking.repository;

import com.Nhom2.booking.entity.Notification;
import com.Nhom2.booking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserOrderByCreatedAtDesc(User user);
}
