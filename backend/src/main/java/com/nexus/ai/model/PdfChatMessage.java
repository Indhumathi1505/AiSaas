package com.nexus.ai.model;

import lombok.Data;

@Data
public class PdfChatMessage {
    private String id;
    private String sender;
    private String text;
    private String timestamp;
    private Integer pageReference;
}
