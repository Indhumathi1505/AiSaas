package com.nexus.ai.model;

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
}
