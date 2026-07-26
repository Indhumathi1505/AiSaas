const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'backend', 'src', 'main', 'java', 'com', 'nexus', 'ai', 'model');
fs.mkdirSync(modelsDir, { recursive: true });

const models = {
  'UserProfile.java': `package com.nexus.ai.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "users")
public class UserProfile {
    @Id
    private String id;
    private String name;
    private String email;
    private String avatarUrl;
    private String role;
    private boolean twoFactorEnabled;
    private String createdAt;
    private String workspaceName;
    private String aiModel;
    private String theme;
}`,
  'DocumentVersion.java': `package com.nexus.ai.model;

import lombok.Data;

@Data
public class DocumentVersion {
    private String id;
    private int versionNumber;
    private String title;
    private String content;
    private String createdAt;
    private String createdBy;
    private String summary;
}`,
  'DocumentItem.java': `package com.nexus.ai.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.util.List;

@Data
@Document(collection = "documents")
public class DocumentItem {
    @Id
    private String id;
    private String title;
    private String content;
    private String folder;
    private List<String> tags;
    private String createdAt;
    private String updatedAt;
    private boolean isShared;
    private List<String> sharedWith;
    private List<DocumentVersion> versions;
    private Integer readabilityScore;
    private Integer grammarIssueCount;
}`,
  'DocumentTemplate.java': `package com.nexus.ai.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "templates")
public class DocumentTemplate {
    @Id
    private String id;
    private String title;
    private String category;
    private String description;
    private String content;
    private String iconName;
}`,
  'PdfDocument.java': `package com.nexus.ai.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Document(collection = "pdf_documents")
public class PdfDocument {
    @Id
    private String id;
    private String filename;
    private String fileSize;
    private int pageCount;
    private String uploadedAt;
    private String extractedText;
    private List<PageSummary> pageSummaries;
    private List<Flashcard> flashcards;
    private List<Mcq> mcqs;
    private List<String> notes;
    private List<Table> tables;
    private List<String> references;
    
    @Data public static class PageSummary { private int pageNumber; private String summary; }
    @Data public static class Flashcard { private String question; private String answer; }
    @Data public static class Mcq { private String question; private List<String> options; private int answerIndex; private String explanation; }
    @Data public static class Table { private List<String> headers; private List<List<String>> rows; }
}`,
  'PdfChatMessage.java': `package com.nexus.ai.model;

import lombok.Data;

@Data
public class PdfChatMessage {
    private String id;
    private String sender;
    private String text;
    private String timestamp;
    private Integer pageReference;
}`,
  'PdfChatHistory.java': `package com.nexus.ai.model;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.util.List;

@Data
@Document(collection = "pdf_chat_histories")
public class PdfChatHistory {
    @Id
    private String pdfId;
    private List<PdfChatMessage> messages;
}`,
  'FinanceTransaction.java': `package com.nexus.ai.model;

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
}`,
  'FinanceBudget.java': `package com.nexus.ai.model;

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
}`,
  'FinanceGoal.java': `package com.nexus.ai.model;

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
}`,
  'FinanceSubscription.java': `package com.nexus.ai.model;

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
}`,
  'CopilotMessage.java': `package com.nexus.ai.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.util.List;

@Data
@Document(collection = "copilot_messages")
public class CopilotMessage {
    @Id
    private String id;
    private String sender;
    private String content;
    private String timestamp;
    private String contextUsed;
    private List<String> sources;
    private List<String> suggestedActions;
}`,
  'NotificationItem.java': `package com.nexus.ai.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "notifications")
public class NotificationItem {
    @Id
    private String id;
    private String title;
    private String message;
    private String category;
    private String timestamp;
    private boolean isRead;
}`,
  'AuditLogItem.java': `package com.nexus.ai.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "audit_logs")
public class AuditLogItem {
    @Id
    private String id;
    private String action;
    private String user;
    private String timestamp;
    private String details;
    private String ipAddress;
}`
};

for (const [filename, content] of Object.entries(models)) {
  fs.writeFileSync(path.join(modelsDir, filename), content);
}

console.log('Java models generated successfully.');
