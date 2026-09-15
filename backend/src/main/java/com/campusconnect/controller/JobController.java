package com.campusconnect.controller;

import com.campusconnect.entity.Job;
import com.campusconnect.service.JobService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public ResponseEntity<Page<Job>> getJobs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String experience,
            @RequestParam(required = false) String batch,
            @RequestParam(required = false) String workMode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        return ResponseEntity.ok(jobService.getJobs(search, category, type, experience, batch, workMode, page, size));
    }

    @GetMapping("/saved")
    public ResponseEntity<List<Job>> getSavedJobs(@AuthenticationPrincipal String userEmail) {
        if (userEmail == null || userEmail.isBlank()) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        return ResponseEntity.ok(jobService.getSavedJobsForUser(userEmail));
    }

    @GetMapping("/saved/ids")
    public ResponseEntity<Set<String>> getSavedJobIds(@AuthenticationPrincipal String userEmail) {
        if (userEmail == null || userEmail.isBlank()) {
            return ResponseEntity.ok(Collections.emptySet());
        }
        return ResponseEntity.ok(jobService.getSavedJobIdsForUser(userEmail));
    }

    @PostMapping("/{id}/save")
    public ResponseEntity<Map<String, Object>> toggleSaveJob(
            @PathVariable String id,
            @AuthenticationPrincipal String userEmail
    ) {
        if (userEmail == null || userEmail.isBlank()) {
            return ResponseEntity.status(401).body(Map.of("error", "Authentication required to bookmark jobs"));
        }
        return ResponseEntity.ok(jobService.toggleSaveJob(userEmail, id));
    }

    @GetMapping("/applications")
    public ResponseEntity<List<Map<String, Object>>> getApplications(@AuthenticationPrincipal String userEmail) {
        if (userEmail == null || userEmail.isBlank()) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        return ResponseEntity.ok(jobService.getUserApplications(userEmail));
    }

    @PostMapping("/{id}/apply")
    public ResponseEntity<Map<String, Object>> applyForJob(
            @PathVariable String id,
            @AuthenticationPrincipal String userEmail,
            @RequestBody Map<String, String> payload
    ) {
        if (userEmail == null || userEmail.isBlank()) {
            return ResponseEntity.status(401).body(Map.of("error", "Authentication required to apply"));
        }
        return ResponseEntity.ok(jobService.applyForJob(userEmail, id, payload));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable String id) {
        return jobService.getJobById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

