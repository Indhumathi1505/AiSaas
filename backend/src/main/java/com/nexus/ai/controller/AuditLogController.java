package com.nexus.ai.controller;

import com.nexus.ai.model.AuditLogItem;
import com.nexus.ai.repository.AuditLogItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {

    @Autowired
    private AuditLogItemRepository repository;

    @GetMapping
    public List<AuditLogItem> getAllAuditLogs() {
        return repository.findAll();
    }
}
