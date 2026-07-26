package com.nexus.ai.controller;

import com.nexus.ai.model.DocumentItem;
import com.nexus.ai.model.DocumentTemplate;
import com.nexus.ai.model.DocumentVersion;
import com.nexus.ai.model.UserProfile;
import com.nexus.ai.repository.DocumentItemRepository;
import com.nexus.ai.repository.DocumentTemplateRepository;
import com.nexus.ai.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Arrays;

@RestController
@RequestMapping("/api")
public class DocumentController {

    @Autowired
    private DocumentItemRepository documentRepository;

    @Autowired
    private DocumentTemplateRepository templateRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/documents")
    public List<DocumentItem> getDocuments() {
        return documentRepository.findAll();
    }

    @GetMapping("/documents/{id}")
    public DocumentItem getDocument(@PathVariable String id) {
        return documentRepository.findById(id).orElse(null); // Assuming error handling is done in frontend if null
    }

    @PostMapping("/documents")
    public DocumentItem createDocument(@RequestBody Map<String, Object> body) {
        DocumentItem doc = new DocumentItem();
        doc.setId("doc_" + System.currentTimeMillis());
        doc.setTitle((String) body.getOrDefault("title", "Untitled Workspace Document"));
        doc.setContent((String) body.getOrDefault("content", "# Untitled Document\n\nStart typing with AI Copilot assistance..."));
        doc.setFolder((String) body.getOrDefault("folder", "General"));
        
        List<String> tags = (List<String>) body.get("tags");
        if (tags == null) tags = Arrays.asList("Draft");
        doc.setTags(tags);
        
        String now = Instant.now().toString();
        doc.setCreatedAt(now);
        doc.setUpdatedAt(now);
        doc.setShared(false);
        doc.setSharedWith(new ArrayList<>());
        doc.setReadabilityScore(80);
        doc.setGrammarIssueCount(0);
        doc.setVersions(new ArrayList<>());
        
        return documentRepository.save(doc);
    }

    @PutMapping("/documents/{id}")
    public DocumentItem updateDocument(@PathVariable String id, @RequestBody Map<String, Object> body) {
        Optional<DocumentItem> optDoc = documentRepository.findById(id);
        if (!optDoc.isPresent()) return null;
        
        DocumentItem doc = optDoc.get();
        Boolean createVersion = (Boolean) body.get("createVersion");
        String content = (String) body.get("content");
        
        if (Boolean.TRUE.equals(createVersion) && content != null && !content.equals(doc.getContent())) {
            DocumentVersion version = new DocumentVersion();
            version.setId("v_" + System.currentTimeMillis());
            version.setVersionNumber(doc.getVersions() == null ? 1 : doc.getVersions().size() + 1);
            version.setTitle(doc.getTitle());
            version.setContent(doc.getContent());
            version.setCreatedAt(Instant.now().toString());
            
            UserProfile user = userRepository.findById("usr_personal_01").orElse(null);
            version.setCreatedBy(user != null ? user.getName() : "Unknown");
            
            if (doc.getVersions() == null) doc.setVersions(new ArrayList<>());
            doc.getVersions().add(0, version);
        }
        
        if (body.containsKey("title")) doc.setTitle((String) body.get("title"));
        if (body.containsKey("content")) doc.setContent(content);
        if (body.containsKey("folder")) doc.setFolder((String) body.get("folder"));
        if (body.containsKey("tags")) doc.setTags((List<String>) body.get("tags"));
        
        doc.setUpdatedAt(Instant.now().toString());
        return documentRepository.save(doc);
    }

    @DeleteMapping("/documents/{id}")
    public Map<String, Boolean> deleteDocument(@PathVariable String id) {
        documentRepository.deleteById(id);
        Map<String, Boolean> res = new HashMap<>();
        res.put("success", true);
        return res;
    }

    @GetMapping("/templates")
    public List<DocumentTemplate> getTemplates() {
        return templateRepository.findAll();
    }
}
