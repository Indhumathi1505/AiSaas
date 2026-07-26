package com.nexus.ai.controller;

import com.nexus.ai.model.CopilotMessage;
import com.nexus.ai.model.DocumentItem;
import com.nexus.ai.model.PdfDocument;
import com.nexus.ai.model.FinanceTransaction;
import com.nexus.ai.repository.CopilotMessageRepository;
import com.nexus.ai.repository.DocumentItemRepository;
import com.nexus.ai.repository.PdfDocumentRepository;
import com.nexus.ai.repository.FinanceTransactionRepository;
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
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private CopilotMessageRepository copilotRepository;

    @Autowired
    private DocumentItemRepository documentRepository;

    @Autowired
    private PdfDocumentRepository pdfRepository;

    @Autowired
    private FinanceTransactionRepository financeRepository;

    @Autowired
    private GeminiService geminiService;

    private final ObjectMapper mapper = new ObjectMapper();

    @PostMapping("/copilot")
    public CopilotMessage copilot(@RequestBody Map<String, Object> body) {
        String message = (String) body.get("message");
        String contextPage = (String) body.get("contextPage");
        
        CopilotMessage userMsg = new CopilotMessage();
        userMsg.setId("copilot_" + System.currentTimeMillis());
        userMsg.setSender("user");
        userMsg.setContent(message);
        userMsg.setTimestamp(Instant.now().toString());
        copilotRepository.save(userMsg);

        String prompt = "You are Nexus Copilot, a high-level enterprise AI assistant built into an integrated SaaS workspace.\n" +
            "Current Active Page: " + (contextPage != null ? contextPage : "Dashboard") + "\n\n" +
            "Respond intelligently in clear Markdown format with headings, bullet points, or code blocks where appropriate. Be professional, direct, and actionable.\n\n" +
            "User Prompt: " + message;

        CopilotMessage aiMsg = new CopilotMessage();
        aiMsg.setId("copilot_" + (System.currentTimeMillis() + 1));
        aiMsg.setSender("assistant");
        aiMsg.setTimestamp(Instant.now().toString());
        aiMsg.setContextUsed(contextPage);
        aiMsg.setSources(List.of("Nexus Document Engine", "Financial Telemetry"));
        aiMsg.setSuggestedActions(List.of("Apply changes to active document", "Export as executive PDF report", "Generate follow-up action plan"));

        try {
            String aiText = geminiService.generateContent(prompt);
            aiMsg.setContent(aiText != null && !aiText.isEmpty() ? aiText : "I have analyzed your workspace query.");
        } catch (Exception e) {
            aiMsg.setContent("**Connection Error**\n\n" + e.getMessage() + "\n\nIf you are using a placeholder API key, please update `gemini.api.key` in `backend/src/main/resources/application.properties` with a valid Google Gemini API key and restart the backend.");
        }
        
        return copilotRepository.save(aiMsg);
    }

    @PostMapping("/grammar-check")
    public Map<String, Object> grammarCheck(@RequestBody Map<String, String> body) {
        String text = body.get("text");
        if (text == null || text.isEmpty()) {
            Map<String, Object> res = new HashMap<>();
            res.put("corrections", new ArrayList<>());
            res.put("score", 100);
            res.put("summary", "No text provided.");
            return res;
        }

        try {
            String prompt = "Analyze the following text for grammar, spelling, clarity, and tone issues:\n\"" + text + "\"\nReturn JSON with keys: score, summary, corrections (array of {original, suggestion, reason})";
            String aiText = geminiService.generateContent(prompt, "application/json");
            return mapper.readValue(aiText, Map.class);
        } catch (Exception e) {
            Map<String, Object> res = new HashMap<>();
            res.put("score", 0);
            res.put("summary", "AI Error: " + e.getMessage());
            res.put("corrections", new ArrayList<>());
            return res;
        }
    }

    @PostMapping("/dictionary")
    public Map<String, Object> dictionary(@RequestBody Map<String, String> body) {
        String word = body.get("word");
        try {
            String prompt = "Provide a rich dictionary definition for the term: \"" + word + "\". Return JSON with keys: word, phonetic, partOfSpeech, definition, examples, synonyms, antonyms.";
            String aiText = geminiService.generateContent(prompt, "application/json");
            return mapper.readValue(aiText, Map.class);
        } catch (Exception e) {
            Map<String, Object> res = new HashMap<>();
            res.put("word", word);
            res.put("phonetic", "N/A");
            res.put("partOfSpeech", "error");
            res.put("definition", "AI Error: " + e.getMessage());
            res.put("examples", new ArrayList<>());
            res.put("synonyms", new ArrayList<>());
            res.put("antonyms", new ArrayList<>());
            return res;
        }
    }

    @PostMapping("/rewrite")
    public Map<String, String> rewrite(@RequestBody Map<String, String> body) {
        String text = body.get("text");
        String mode = body.getOrDefault("mode", "professional enterprise");
        Map<String, String> res = new HashMap<>();
        try {
            String prompt = "Rewrite the following text in a " + mode + " tone while maintaining the core message:\n\"" + text + "\"";
            res.put("rewrittenText", geminiService.generateContent(prompt));
        } catch (Exception e) {
            res.put("rewrittenText", "AI Error: " + e.getMessage());
        }
        return res;
    }

    @PostMapping("/generate")
    public Map<String, String> generate(@RequestBody Map<String, String> body) {
        String type = body.get("type");
        String topic = body.get("topic");
        String context = body.getOrDefault("context", "Enterprise SaaS environment");
        Map<String, String> res = new HashMap<>();
        try {
            String prompt = "Generate a comprehensive, professionally formatted Markdown document of type \"" + type + "\" for topic: \"" + topic + "\". Context: " + context + ". Use structured headers, bullet points, and high quality content.";
            res.put("generatedContent", geminiService.generateContent(prompt));
        } catch (Exception e) {
            res.put("generatedContent", "AI Error: " + e.getMessage());
        }
        return res;
    }

    @PostMapping("/explain")
    public Map<String, String> explain(@RequestBody Map<String, String> body) {
        String selection = body.get("selection");
        String fullContent = body.get("fullContent");
        Map<String, String> res = new HashMap<>();
        try {
            String prompt = "Explain the following selected text in context:\nSelected Text: \"" + selection + "\"\nFull Document Context: \"" + (fullContent != null ? fullContent.substring(0, Math.min(fullContent.length(), 500)) : "") + "\"\nProvide a clear 2-3 paragraph explanation including context, relevance, and key takeaways.";
            res.put("explanation", geminiService.generateContent(prompt));
        } catch (Exception e) {
            res.put("explanation", "AI Error: " + e.getMessage());
        }
        return res;
    }
}
