package com.nexus.ai.model;

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
    private String password;
    private String avatarUrl;
    private String role;
    private boolean twoFactorEnabled;
    private String createdAt;
    private String workspaceName;
    private String aiModel;
    private String theme;
}
