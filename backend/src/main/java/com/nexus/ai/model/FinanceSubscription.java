package com.nexus.ai.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "finance_subscriptions")
public class FinanceSubscription {
    @Id
    private String id;
    private String name;
    private double monthlyCost;
    private String billingCycle;
    private String lastUsedDate;
    private boolean isUnused;
    private String nextRenewal;
}
