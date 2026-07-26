package com.nexus.ai.model;

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
}
