package com.nexus.ai.controller;

import com.nexus.ai.model.NotificationItem;
import com.nexus.ai.repository.NotificationItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationItemRepository repository;

    @GetMapping
    public List<NotificationItem> getAllNotifications() {
        return repository.findAll();
    }

    @PutMapping("/read-all")
    public void markAllAsRead() {
        List<NotificationItem> notifications = repository.findAll();
        for (NotificationItem item : notifications) {
            item.setRead(true);
        }
        repository.saveAll(notifications);
    }
}
