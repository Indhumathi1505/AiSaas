package com.nexus.ai.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

@Service
public class GeminiService {

    @Value("${groq.api.key}")
    private String apiKey;

    private static final String API_URL = "https://api.groq.com/openai/v1/chat/completions";
    private final RestTemplate restTemplate = new RestTemplate();

    public String generateContent(String prompt) {
        return generateContent(prompt, "text/plain");
    }

    public String generateContent(String prompt, String responseMimeType) {
        try {
            Map<String, Object> requestBody = new HashMap<>();
            
            // Groq uses llama-3.1-8b-instant
            requestBody.put("model", "llama-3.1-8b-instant");
            
            // Construct the messages array
            Map<String, String> message = new HashMap<>();
            message.put("role", "user");
            
            // If they want JSON, we should instruct the model to return JSON
            if (responseMimeType != null && responseMimeType.equals("application/json")) {
                message.put("content", prompt + "\n\nPlease ensure your response is strictly valid JSON.");
                
                Map<String, String> responseFormat = new HashMap<>();
                responseFormat.put("type", "json_object");
                requestBody.put("response_format", responseFormat);
            } else {
                message.put("content", prompt);
            }
            
            requestBody.put("messages", List.of(message));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey); // Groq requires Bearer Auth

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(API_URL, entity, Map.class);
            
            // Parse OpenAI-compatible response format from Groq
            if (response.getBody() != null && response.getBody().containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> choice = choices.get(0);
                    Map<String, Object> resMessage = (Map<String, Object>) choice.get("message");
                    if (resMessage != null && resMessage.containsKey("content")) {
                        return (String) resMessage.get("content");
                    }
                }
            }
            return "";
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            System.err.println("Groq API Error: " + e.getResponseBodyAsString());
            throw new RuntimeException("Groq API Error: " + e.getStatusCode() + " - Please check your Groq API key.", e);
        } catch (Exception e) {
            System.err.println("Groq API Error: " + e.getMessage());
            throw new RuntimeException("AI processing failed: " + e.getMessage(), e);
        }
    }
}
