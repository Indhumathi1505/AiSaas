package com.nexus.ai.repository;

import com.nexus.ai.model.PdfChatHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PdfChatHistoryRepository extends MongoRepository<PdfChatHistory, String> {
}
