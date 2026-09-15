package com.campusconnect.controller;

import com.campusconnect.entity.PlacementQuestion;
import com.campusconnect.entity.PlacementTrack;
import com.campusconnect.service.PlacementTrackService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PlacementTrackController {

    private final PlacementTrackService trackService;

    public PlacementTrackController(PlacementTrackService trackService) {
        this.trackService = trackService;
    }

    @GetMapping("/public/placement/tracks")
    public ResponseEntity<List<Map<String, Object>>> getAllTracks() {
        return ResponseEntity.ok(trackService.getAllTracksSummary());
    }

    @GetMapping("/public/placement/tracks/{slug}")
    public ResponseEntity<PlacementTrack> getTrackBySlug(@PathVariable String slug) {
        return trackService.getTrackBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/public/placement/practice")
    public ResponseEntity<List<PlacementQuestion>> getPracticeQuestions(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String difficulty) {
        return ResponseEntity.ok(trackService.getPracticeQuestions(category, difficulty));
    }

    @GetMapping("/placement/progress")
    public ResponseEntity<Map<String, Object>> getUserProgress(@AuthenticationPrincipal String userEmail) {
        if (userEmail == null || userEmail.isBlank()) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        return ResponseEntity.ok(trackService.getUserPlacementProgress(userEmail));
    }

    @PostMapping("/placement/progress")
    public ResponseEntity<Map<String, Object>> toggleProgress(
            @AuthenticationPrincipal String userEmail,
            @RequestBody Map<String, Object> payload) {
        if (userEmail == null || userEmail.isBlank()) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        String trackSlug = (String) payload.get("trackSlug");
        Object topicIdObj = payload.get("topicId");
        Long topicId = topicIdObj instanceof Number ? ((Number) topicIdObj).longValue() : Long.parseLong(topicIdObj.toString());

        return ResponseEntity.ok(trackService.toggleTopicCompletion(userEmail, trackSlug, topicId));
    }
}
