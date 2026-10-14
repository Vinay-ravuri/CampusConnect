package com.campusconnect.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeminiService {

    @Value("${app.ai.gemini.api-key:}")
    private String apiKey;

    @Value("${app.ai.gemini.model-url:https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent}")
    private String modelUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public boolean hasApiKey() {
        return apiKey != null && !apiKey.trim().isEmpty() && !apiKey.contains("VITE_");
    }

    /**
     * Generate content with text prompt and optional system instructions.
     */
    public Map<String, Object> generateStructuredJson(String systemInstruction, String userPrompt) {
        if (!hasApiKey()) {
            return null;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> requestBody = new HashMap<>();

            // System instruction if provided
            if (systemInstruction != null && !systemInstruction.isBlank()) {
                requestBody.put("systemInstruction", Map.of(
                    "parts", List.of(Map.of("text", systemInstruction))
                ));
            }

            // User content
            requestBody.put("contents", List.of(
                Map.of("parts", List.of(Map.of("text", userPrompt + "\n\nRespond ONLY with a valid JSON object matching the requested schema. No code fences, no extra text.")))
            ));

            // Generation config
            requestBody.put("generationConfig", Map.of(
                "temperature", 0.3,
                "responseMimeType", "application/json"
            ));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            String url = modelUrl.contains("?") ? modelUrl + "&key=" + apiKey : modelUrl + "?key=" + apiKey;

            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return parseCandidateContent(response.getBody());
            }
        } catch (Exception e) {
            System.err.println("Gemini structured JSON generation failed: " + e.getMessage());
        }

        return null;
    }

    /**
     * Generate content with a PDF attachment (base64).
     */
    public Map<String, Object> generateWithPdf(byte[] pdfBytes, String prompt) {
        if (!hasApiKey() || pdfBytes == null || pdfBytes.length == 0) {
            return null;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String base64Data = Base64.getEncoder().encodeToString(pdfBytes);

            Map<String, Object> inlineData = Map.of(
                "mimeType", "application/pdf",
                "data", base64Data
            );

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", List.of(
                Map.of("parts", List.of(
                    Map.of("inlineData", inlineData),
                    Map.of("text", prompt + "\n\nAnalyze this resume document thoroughly and return ONLY raw JSON matching the required schema.")
                ))
            ));

            requestBody.put("generationConfig", Map.of(
                "temperature", 0.2,
                "responseMimeType", "application/json"
            ));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            String url = modelUrl.contains("?") ? modelUrl + "&key=" + apiKey : modelUrl + "?key=" + apiKey;

            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return parseCandidateContent(response.getBody());
            }
        } catch (Exception e) {
            System.err.println("Gemini multimodal PDF analysis failed: " + e.getMessage());
        }

        return null;
    }

    /**
     * Chat message generation with conversation history.
     */
    public String generateChatResponse(List<Map<String, String>> history, String userMessage, String contextInfo) {
        if (!hasApiKey()) {
            return null;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            List<Map<String, Object>> contents = new ArrayList<>();

            // Append history
            if (history != null) {
                for (Map<String, String> msg : history) {
                    String role = "user".equalsIgnoreCase(msg.get("role")) ? "user" : "model";
                    String text = msg.get("content") != null ? msg.get("content") : msg.get("text");
                    if (text != null && !text.isBlank()) {
                        contents.add(Map.of("role", role, "parts", List.of(Map.of("text", text))));
                    }
                }
            }

            // Current message
            String prompt = userMessage;
            if (contextInfo != null && !contextInfo.isBlank()) {
                prompt = "[Context: " + contextInfo + "]\n\n" + userMessage;
            }
            contents.add(Map.of("role", "user", "parts", List.of(Map.of("text", prompt))));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", contents);
            requestBody.put("systemInstruction", Map.of(
                "parts", List.of(Map.of("text", "You are CampusConnect AI — an elite technical career advisor, mock interviewer, and engineering placement mentor for Indian students. Give structured, helpful markdown answers with code examples and interview tips."))
            ));
            requestBody.put("generationConfig", Map.of("temperature", 0.6));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            String url = modelUrl.contains("?") ? modelUrl + "&key=" + apiKey : modelUrl + "?key=" + apiKey;

            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map candidates = (Map) ((List) response.getBody().get("candidates")).get(0);
                Map content = (Map) candidates.get("content");
                return (String) ((Map) ((List) content.get("parts")).get(0)).get("text");
            }
        } catch (Exception e) {
            System.err.println("Gemini chat generation failed: " + e.getMessage());
        }

        return null;
    }

    private Map<String, Object> parseCandidateContent(Map body) {
        try {
            List candidates = (List) body.get("candidates");
            if (candidates == null || candidates.isEmpty()) return null;
            Map firstCandidate = (Map) candidates.get(0);
            Map content = (Map) firstCandidate.get("content");
            List parts = (List) content.get("parts");
            String rawText = (String) ((Map) parts.get(0)).get("text");
            String cleaned = stripFences(rawText);
            return objectMapper.readValue(cleaned, Map.class);
        } catch (Exception e) {
            System.err.println("Error parsing candidate response: " + e.getMessage());
            return null;
        }
    }

    private String stripFences(String text) {
        if (text == null) return "{}";
        String s = text.trim();
        if (s.startsWith("```json")) s = s.substring(7);
        else if (s.startsWith("```")) s = s.substring(3);
        if (s.endsWith("```")) s = s.substring(0, s.length() - 3);
        return s.trim();
    }
}
