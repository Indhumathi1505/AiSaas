package com.nexus.ai.repository;

import com.nexus.ai.model.DocumentItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentItemRepository extends MongoRepository<DocumentItem, String> {
}
