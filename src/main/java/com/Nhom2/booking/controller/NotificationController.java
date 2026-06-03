package com.Nhom2.booking.controller;

import com.Nhom2.booking.entity.Notification;
import com.Nhom2.booking.service.NotificationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/my")
    public List<Notification> getMyNotifications() {
        return notificationService.getMyNotifications();
    }

    @PutMapping("/{notificationId}/read")
    public Notification markAsRead(@PathVariable Long notificationId) {
        return notificationService.markAsRead(notificationId);
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/{notificationId}")
    public void deleteNotification(@PathVariable Long notificationId) {
        notificationService.deleteNotification(notificationId);
    }
}
