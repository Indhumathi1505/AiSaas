package com.nexus.ai.model;

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
}
