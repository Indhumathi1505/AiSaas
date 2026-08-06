package com.nexus.ai.controller;

import com.nexus.ai.model.PdfDocument;
import com.nexus.ai.model.PdfChatHistory;
import com.nexus.ai.model.PdfChatMessage;
import com.nexus.ai.repository.PdfDocumentRepository;
import com.nexus.ai.repository.PdfChatHistoryRepository;
import com.nexus.ai.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pdf")
public class PdfController {

    @Autowired
    private PdfDocumentRepository pdfRepository;

    @Autowired
    private PdfChatHistoryRepository chatHistoryRepository;

    @Autowired
    private GeminiService geminiService;

    private final ObjectMapper mapper = new ObjectMapper()
        .configure(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
        .configure(com.fasterxml.jackson.core.JsonParser.Feature.ALLOW_COMMENTS, true);

    @GetMapping
    public List<PdfDocument> getPdfs() {
        return pdfRepository.findAll();
    }

    @GetMapping("/{id}")
    public PdfDocument getPdf(@PathVariable String id) {
        return pdfRepository.findById(id).orElse(null);
    }

    @DeleteMapping("/{id}")
    public Map<String, Boolean> deletePdf(@PathVariable String id) {
        pdfRepository.deleteById(id);
        chatHistoryRepository.deleteById(id);
        Map<String, Boolean> res = new HashMap<>();
        res.put("success", true);
        return res;
    }

    @PostMapping("/upload")
    public PdfDocument uploadPdf(@RequestBody Map<String, String> body) {
        String filename = body.getOrDefault("filename", "Uploaded_Document.pdf");
        String extractedText = body.get("extractedText");
        
        String textContent = (extractedText != null && !extractedText.trim().isEmpty())
            ? extractedText
            : "Document: " + filename + ".\nThis document contains user notes, technical specifications, or study material.";

        List<PdfDocument.PageSummary> pageSummaries = new ArrayList<>();
        PdfDocument.PageSummary summary = new PdfDocument.PageSummary();
        summary.setPageNumber(1);
        summary.setSummary("Overview of document content.");
        pageSummaries.add(summary);
        
        List<PdfDocument.Flashcard> flashcards = new ArrayList<>();
        PdfDocument.Flashcard flashcard = new PdfDocument.Flashcard();
        flashcard.setQuestion("What is the main theme of this document?");
        flashcard.setAnswer("Extracted from uploaded text content.");
        flashcards.add(flashcard);

        List<PdfDocument.Mcq> mcqs = new ArrayList<>();
        PdfDocument.Mcq mcq = new PdfDocument.Mcq();
        mcq.setQuestion("What is discussed in this document?");
        mcq.setOptions(List.of("Main topic from text", "Unrelated subject", "General overview", "None of the above"));
        mcq.setAnswerIndex(0);
        mcq.setExplanation("Derived from the uploaded text content.");
        mcqs.add(mcq);

        List<String> notes = new ArrayList<>();
        notes.add("Uploaded document successfully processed by Gemini AI.");

        try {
            String prompt = "You are a document analysis AI. Analyze the following document text and return JSON:\n" +
                "{\n" +
                "  \"pageSummaries\": [{ \"pageNumber\": 1, \"summary\": \"Concise summary of section 1\" }],\n" +
                "  \"flashcards\": [{ \"question\": \"Key concept question?\", \"answer\": \"Detailed answer based on text\" }],\n" +
                "  \"mcqs\": [{\n" +
                "      \"question\": \"Multiple choice question testing document understanding?\",\n" +
                "      \"options\": [\"Option A\", \"Option B\", \"Option C\", \"Option D\"],\n" +
                "      \"answerIndex\": 0,\n" +
                "      \"explanation\": \"Clear explanation citing the text\"\n" +
                "    }],\n" +
                "  \"notes\": [\"Key takeaway 1\", \"Key takeaway 2\"]\n" +
                "}\n\nDocument Title: " + filename + "\nDocument Content:\n" +
                (textContent.length() > 4000 ? textContent.substring(0, 4000) : textContent);

            String responseText = geminiService.generateContent(prompt, "application/json");
            int start = responseText.indexOf('{');
            int end = responseText.lastIndexOf('}');
            if (start != -1 && end != -1 && end >= start) {
                responseText = responseText.substring(start, end + 1);
            }
            Map<String, Object> parsed = mapper.readValue(responseText, Map.class);
            
            if (parsed.containsKey("pageSummaries")) {
                pageSummaries = mapper.convertValue(parsed.get("pageSummaries"), new com.fasterxml.jackson.core.type.TypeReference<List<PdfDocument.PageSummary>>(){});
            }
            if (parsed.containsKey("flashcards")) {
                flashcards = mapper.convertValue(parsed.get("flashcards"), new com.fasterxml.jackson.core.type.TypeReference<List<PdfDocument.Flashcard>>(){});
            }
            if (parsed.containsKey("mcqs")) {
                mcqs = mapper.convertValue(parsed.get("mcqs"), new com.fasterxml.jackson.core.type.TypeReference<List<PdfDocument.Mcq>>(){});
            }
            if (parsed.containsKey("notes")) {
                notes = mapper.convertValue(parsed.get("notes"), new com.fasterxml.jackson.core.type.TypeReference<List<String>>(){});
            }
        } catch (Exception e) {
            e.printStackTrace();
            notes.add("Note: Detailed AI extraction failed or was incomplete. " + e.getMessage());
        }

        int estimatedPages = Math.max(1, (int) Math.ceil((double) textContent.length() / 800));

        PdfDocument newPdf = new PdfDocument();
        newPdf.setId("pdf_" + System.currentTimeMillis());
        newPdf.setFilename(filename);
        newPdf.setFileSize(String.format("%.1f KB", textContent.length() / 1024.0));
        newPdf.setPageCount(estimatedPages);
        newPdf.setUploadedAt(Instant.now().toString());
        newPdf.setExtractedText(textContent);
        newPdf.setPageSummaries(pageSummaries);
        newPdf.setFlashcards(flashcards);
        newPdf.setMcqs(mcqs);
        newPdf.setNotes(notes);
        newPdf.setTables(new ArrayList<>());
        newPdf.setReferences(List.of("Document Source: " + filename));

        pdfRepository.save(newPdf);

        PdfChatHistory history = new PdfChatHistory();
        history.setPdfId(newPdf.getId());
        List<PdfChatMessage> msgs = new ArrayList<>();
        PdfChatMessage welcomeMsg = new PdfChatMessage();
        welcomeMsg.setId("msg_welcome_" + System.currentTimeMillis());
        welcomeMsg.setSender("ai");
        welcomeMsg.setText("I have analyzed \"" + newPdf.getFilename() + "\". You can ask me any question here in the chat, or **click the tabs at the top** (Page Summaries, Flashcards, MCQs, Key Notes) to view the AI-generated study materials!");
        welcomeMsg.setTimestamp(Instant.now().toString());
        msgs.add(welcomeMsg);
        history.setMessages(msgs);
        chatHistoryRepository.save(history);

        return newPdf;
    }

    @GetMapping("/{id}/chat")
    public List<PdfChatMessage> getChatHistory(@PathVariable String id) {
        return chatHistoryRepository.findById(id).map(PdfChatHistory::getMessages).orElse(new ArrayList<>());
    }

    @PostMapping("/{id}/chat")
    public PdfChatMessage sendChatMessage(@PathVariable String id, @RequestBody Map<String, String> body) {
        PdfDocument pdf = pdfRepository.findById(id).orElse(null);
        if (pdf == null) return null;

        String question = body.get("question");
        PdfChatHistory history = chatHistoryRepository.findById(id).orElse(new PdfChatHistory());
        history.setPdfId(id);
        if (history.getMessages() == null) history.setMessages(new ArrayList<>());

        PdfChatMessage userMsg = new PdfChatMessage();
        userMsg.setId("pdf_msg_" + System.currentTimeMillis());
        userMsg.setSender("user");
        userMsg.setText(question);
        userMsg.setTimestamp(Instant.now().toString());
        history.getMessages().add(userMsg);

        PdfChatMessage aiMsg = new PdfChatMessage();
        aiMsg.setId("pdf_msg_" + (System.currentTimeMillis() + 1));
        aiMsg.setSender("ai");
        aiMsg.setTimestamp(Instant.now().toString());
        aiMsg.setPageReference(1);

        try {
            String prompt = "You are a strict PDF AI assistant. You must answer the user question based ONLY on the provided PDF content below. Give clear, detailed explanations and quote key lines if appropriate.\n" +
                "If the user asks for flashcards, MCQs, summaries, or quizzes, politely inform them that these are automatically generated and can be accessed by clicking the tabs (Flashcards, MCQs & Quiz, etc.) at the top of the workspace.\n\n" +
                "PDF Document Title: " + pdf.getFilename() + "\n" +
                "PDF Content:\n" + pdf.getExtractedText() + "\n\n" +
                "User Question: " + question;

            String responseText = geminiService.generateContent(prompt);
            aiMsg.setText(responseText != null && !responseText.isEmpty() ? responseText : "I could not generate an answer based on the PDF.");
        } catch (Exception e) {
            String snippet = pdf.getExtractedText().length() > 150 ? pdf.getExtractedText().substring(0, 150) : pdf.getExtractedText();
            aiMsg.setText("Based on \"" + pdf.getFilename() + "\": I have analyzed the document text provided. " + snippet + "...");
        }

        history.getMessages().add(aiMsg);
        chatHistoryRepository.save(history);
        return aiMsg;
    }
}
