package com.nexus.ai.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "finance_transactions")
public class FinanceTransaction {
    @Id
    private String id;
    private String date;
    private String type;
    private String category;
    private double amount;
    private String description;
    private String paymentMethod;
    private Boolean isRecurring;
}
