package com.nexus.ai.model;
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
}
