package com.nexus.ai.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "finance_budgets")
public class FinanceBudget {
    @Id
    private String id;
    private String category;
    private double monthlyLimit;
    private double spent;
}
