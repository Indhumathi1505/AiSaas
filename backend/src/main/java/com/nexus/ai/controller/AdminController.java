package com.nexus.ai.controller;

import com.nexus.ai.model.UserProfile;
import com.nexus.ai.model.AuditLogItem;
import com.nexus.ai.repository.UserRepository;
import com.nexus.ai.repository.AuditLogItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditLogItemRepository auditLogItemRepository;

    @GetMapping("/users")
    public List<UserProfile> getAllUsers(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        // Simple mock authentication for admin portal demonstration
        if (authHeader == null || !authHeader.equals("Bearer admin123")) {
            throw new RuntimeException("Unauthorized");
        }
        return userRepository.findAll();
    }

    @GetMapping("/audit-logs")
    public List<AuditLogItem> getAuditLogs(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        // Simple mock authentication for admin portal demonstration
        if (authHeader == null || !authHeader.equals("Bearer admin123")) {
            throw new RuntimeException("Unauthorized");
        }
        return auditLogItemRepository.findAll();
    }
}
