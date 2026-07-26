package com.nexus.ai.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "notifications")
public class NotificationItem {
    @Id
    private String id;
    private String title;
    private String message;
    private String category;
    private String timestamp;
    private boolean isRead;
}
