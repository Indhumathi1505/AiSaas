package com.nexus.ai.repository;

import com.nexus.ai.model.FinanceTransaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FinanceTransactionRepository extends MongoRepository<FinanceTransaction, String> {
}
