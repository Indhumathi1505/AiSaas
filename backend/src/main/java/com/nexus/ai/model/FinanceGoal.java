package com.nexus.ai.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "finance_goals")
public class FinanceGoal {
    @Id
    private String id;
    private String title;
    private double targetAmount;
    private double currentAmount;
    private String targetDate;
    private String iconName;
}
