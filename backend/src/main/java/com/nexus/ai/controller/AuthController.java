package com.nexus.ai.controller;

import com.nexus.ai.model.UserProfile;
import com.nexus.ai.model.AuditLogItem;
import com.nexus.ai.repository.UserRepository;
import com.nexus.ai.repository.AuditLogItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditLogItemRepository auditLogRepository;

    @PostMapping("/signup")
    public Map<String, Object> signup(@RequestBody Map<String, String> body, HttpServletRequest request) {
        Map<String, Object> res = new HashMap<>();
        String email = body.get("email");
        String password = body.get("password");
        String name = body.get("name");

        if (email == null || password == null || name == null) {
            res.put("error", "Name, email, and password are required.");
            return res;
        }

        List<UserProfile> users = userRepository.findAll();
        boolean exists = users.stream().anyMatch(u -> email.equals(u.getEmail()));
        if (exists) {
            res.put("error", "Email is already registered.");
            return res;
        }

        UserProfile user = new UserProfile();
        user.setId("usr_" + System.currentTimeMillis());
        user.setName(name);
        user.setEmail(email);
        user.setPassword(password); // in production, hash this password
        user.setAvatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250");
        user.setRole("WORKSPACE_MEMBER");
        user.setTwoFactorEnabled(false);
        user.setCreatedAt(Instant.now().toString());
        user.setWorkspaceName(name + "'s Workspace");
        user.setAiModel("gemini-3.6-flash");
        user.setTheme("light");
        
        userRepository.save(user);

        logAction("USER_SIGNUP", email, "User signed up successfully", request.getRemoteAddr());

        res.put("token", "jwt_token_" + user.getId());
        res.put("user", user);
        return res;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body, HttpServletRequest request) {
        Map<String, Object> res = new HashMap<>();
        String email = body.get("email");
        String password = body.get("password");

        List<UserProfile> users = userRepository.findAll();
        UserProfile user = users.stream()
            .filter(u -> email.equals(u.getEmail()) && password.equals(u.getPassword()))
            .findFirst()
            .orElse(null);

        if (user == null) {
            res.put("error", "Invalid email or password");
            return res;
        }

        logAction("USER_LOGIN", email, "User logged in successfully", request.getRemoteAddr());

        res.put("token", "jwt_token_" + user.getId());
        res.put("user", user);
        return res;
    }

    @GetMapping("/profile")
    public Map<String, Object> getProfile(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        Map<String, Object> res = new HashMap<>();
        if (authHeader == null || !authHeader.startsWith("Bearer jwt_token_")) {
            res.put("error", "Unauthorized");
            return res;
        }
        
        String userId = authHeader.substring("Bearer jwt_token_".length());
        UserProfile user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            res.put("error", "User not found");
            return res;
        }
        
        res.put("user", user);
        return res;
    }

    @PutMapping("/profile")
    public Map<String, Object> updateProfile(@RequestHeader(value = "Authorization", required = false) String authHeader, @RequestBody UserProfile updates) {
        Map<String, Object> res = new HashMap<>();
        if (authHeader == null || !authHeader.startsWith("Bearer jwt_token_")) {
            res.put("error", "Unauthorized");
            return res;
        }
        
        String userId = authHeader.substring("Bearer jwt_token_".length());
        UserProfile user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            res.put("error", "User not found");
            return res;
        }

        if (updates.getName() != null) user.setName(updates.getName());
        if (updates.getWorkspaceName() != null) user.setWorkspaceName(updates.getWorkspaceName());
        if (updates.getAiModel() != null) user.setAiModel(updates.getAiModel());
        if (updates.getTheme() != null) user.setTheme(updates.getTheme());
        user.setTwoFactorEnabled(updates.isTwoFactorEnabled());
        
        userRepository.save(user);
        
        res.put("success", true);
        res.put("user", user);
        return res;
    }

    private void logAction(String action, String userEmail, String details, String ip) {
        AuditLogItem log = new AuditLogItem();
        log.setId("audit_" + System.currentTimeMillis());
        log.setAction(action);
        log.setUser(userEmail);
        log.setTimestamp(Instant.now().toString());
        log.setDetails(details);
        log.setIpAddress(ip);
        auditLogRepository.save(log);
    }
}
