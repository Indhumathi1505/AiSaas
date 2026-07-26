package com.nexus.ai.model;

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
}
