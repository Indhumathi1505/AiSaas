package com.nexus.ai.model;

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
}
