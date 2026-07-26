package com.nexus.ai.repository;

import com.nexus.ai.model.PdfDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PdfDocumentRepository extends MongoRepository<PdfDocument, String> {
}
