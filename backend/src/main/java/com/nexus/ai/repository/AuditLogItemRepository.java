package com.nexus.ai.repository;

import com.nexus.ai.model.AuditLogItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogItemRepository extends MongoRepository<AuditLogItem, String> {
}
