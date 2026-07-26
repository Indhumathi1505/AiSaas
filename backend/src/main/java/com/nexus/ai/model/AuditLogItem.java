package com.nexus.ai.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "audit_logs")
public class AuditLogItem {
    @Id
    private String id;
    private String action;
    private String user;
    private String timestamp;
    private String details;
    private String ipAddress;
}
