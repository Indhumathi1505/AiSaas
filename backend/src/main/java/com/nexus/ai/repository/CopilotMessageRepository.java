package com.nexus.ai.repository;

import com.nexus.ai.model.CopilotMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CopilotMessageRepository extends MongoRepository<CopilotMessage, String> {
}
