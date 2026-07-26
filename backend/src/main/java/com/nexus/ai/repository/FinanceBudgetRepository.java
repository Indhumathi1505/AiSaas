package com.nexus.ai.repository;

import com.nexus.ai.model.FinanceBudget;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FinanceBudgetRepository extends MongoRepository<FinanceBudget, String> {
}
