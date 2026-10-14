package com.campusconnect.controller;

import com.campusconnect.entity.MockInterview;
import com.campusconnect.entity.ResumeAnalysis;
import com.campusconnect.entity.SkillAssessment;
import com.campusconnect.service.AiChatService;
import com.campusconnect.service.MockInterviewService;
import com.campusconnect.service.ResumeAnalysisService;
import com.campusconnect.service.SkillAnalysisService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final ResumeAnalysisService resumeAnalysisService;
    private final SkillAnalysisService skillAnalysisService;
    private final MockInterviewService mockInterviewService;
    private final AiChatService aiChatService;

    public AiController(ResumeAnalysisService resumeAnalysisService,
                        SkillAnalysisService skillAnalysisService,
                        MockInterviewService mockInterviewService,
                        AiChatService aiChatService) {
        this.resumeAnalysisService = resumeAnalysisService;
        this.skillAnalysisService = skillAnalysisService;
        this.mockInterviewService = mockInterviewService;
        this.aiChatService = aiChatService;
    }

    /**
     * Analyze resume via multipart PDF upload.
     */
    @PostMapping(value = "/resume/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> analyzeResumePdf(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "targetRole", required = false) String targetRole,
            @AuthenticationPrincipal String userEmail) {
        try {
            String email = userEmail != null ? userEmail : "student@campusconnect.edu";
            byte[] bytes = file.getBytes();
            String fileName = file.getOriginalFilename();
            Map<String, Object> result = resumeAnalysisService.analyzeResume(bytes, fileName, targetRole, null, email);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to process resume: " + e.getMessage()));
        }
    }

    /**
     * Analyze resume via JSON payload (text/base64).
     */
    @PostMapping(value = "/resume/analyze", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> analyzeResumeJson(
            @RequestBody Map<String, Object> payload,
            @AuthenticationPrincipal String userEmail) {
        String email = userEmail != null ? userEmail : "student@campusconnect.edu";
        String resumeText = (String) payload.get("resumeText");
        String fileName = (String) payload.getOrDefault("fileName", "resume.pdf");
        String targetRole = (String) payload.getOrDefault("targetRole", "Software Development Engineer");
        Map<String, Object> result = resumeAnalysisService.analyzeResume(null, fileName, targetRole, resumeText, email);
        return ResponseEntity.ok(result);
    }

    /**
     * Analyze technical skills and role readiness.
     */
    @PostMapping("/skills/analyze")
    public ResponseEntity<Map<String, Object>> analyzeSkills(
            @RequestBody Map<String, Object> payload,
            @AuthenticationPrincipal String userEmail) {
        String email = userEmail != null ? userEmail : "student@campusconnect.edu";
        return ResponseEntity.ok(skillAnalysisService.analyzeSkills(payload, email));
    }

    /**
     * Create personalized mock interview session with tailored questions.
     */
    @PostMapping("/interview/create")
    public ResponseEntity<Map<String, Object>> createInterview(
            @RequestBody Map<String, Object> payload,
            @AuthenticationPrincipal String userEmail) {
        String email = userEmail != null ? userEmail : "student@campusconnect.edu";
        return ResponseEntity.ok(mockInterviewService.createInterview(payload, email));
    }

    /**
     * Evaluate completed mock interview answers and produce score report.
     */
    @PostMapping("/interview/evaluate")
    public ResponseEntity<Map<String, Object>> evaluateInterview(
            @RequestBody Map<String, Object> payload,
            @AuthenticationPrincipal String userEmail) {
        String email = userEmail != null ? userEmail : "student@campusconnect.edu";
        return ResponseEntity.ok(mockInterviewService.evaluateInterview(payload, email));
    }

    /**
     * Conversational AI Assistant endpoint (Fixes the 'Try Again' bug).
     */
    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(
            @RequestBody Map<String, Object> payload) {
        List<Map<String, String>> history = (List<Map<String, String>>) payload.getOrDefault("history", List.of());
        String message = (String) payload.getOrDefault("message", "");
        String contextInfo = (String) payload.getOrDefault("context", "JOBS_CAREER");
        return ResponseEntity.ok(aiChatService.chat(history, message, contextInfo));
    }

    /**
     * Get user's previous mock interviews.
     */
    @GetMapping("/interview/history")
    public ResponseEntity<List<MockInterview>> getInterviewHistory(
            @AuthenticationPrincipal String userEmail) {
        String email = userEmail != null ? userEmail : "student@campusconnect.edu";
        return ResponseEntity.ok(mockInterviewService.getUserInterviews(email));
    }

    /**
     * Get combined user AI reports (Resume, Skills, Interviews).
     */
    @GetMapping("/reports")
    public ResponseEntity<Map<String, Object>> getUserReports(
            @AuthenticationPrincipal String userEmail) {
        String email = userEmail != null ? userEmail : "student@campusconnect.edu";
        Map<String, Object> reports = new HashMap<>();
        reports.put("resumes", resumeAnalysisService.getUserAnalyses(email));
        reports.put("skills", skillAnalysisService.getUserAssessments(email));
        reports.put("interviews", mockInterviewService.getUserInterviews(email));
        return ResponseEntity.ok(reports);
    }
}
