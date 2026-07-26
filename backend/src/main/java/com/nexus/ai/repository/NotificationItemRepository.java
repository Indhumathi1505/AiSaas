package com.nexus.ai.repository;

import com.nexus.ai.model.NotificationItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationItemRepository extends MongoRepository<NotificationItem, String> {
}
