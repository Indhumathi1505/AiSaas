package com.nexus.ai.repository;

import com.nexus.ai.model.DocumentTemplate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentTemplateRepository extends MongoRepository<DocumentTemplate, String> {
}
