package com.campusconnect.controller;

import com.campusconnect.entity.Job;
import com.campusconnect.entity.PlacementResource;
import com.campusconnect.entity.Resource;
import com.campusconnect.entity.Subject;
import com.campusconnect.service.AcademicService;
import com.campusconnect.service.JobService;
import com.campusconnect.service.PlacementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AcademicService academicService;
    private final JobService jobService;
    private final PlacementService placementService;

    public AdminController(AcademicService academicService, JobService jobService, PlacementService placementService) {
        this.academicService = academicService;
        this.jobService = jobService;
        this.placementService = placementService;
    }

    @PostMapping("/subjects")
    public ResponseEntity<Subject> addSubject(@RequestBody Subject subject) {
        return ResponseEntity.ok(academicService.addSubject(subject));
    }

    @DeleteMapping("/subjects/{id}")
    public ResponseEntity<Map<String, String>> deleteSubject(@PathVariable Long id) {
        academicService.deleteSubject(id);
        return ResponseEntity.ok(Map.of("message", "Subject deleted successfully"));
    }

    @PostMapping("/resources")
    public ResponseEntity<Resource> addResource(@RequestBody Resource resource) {
        return ResponseEntity.ok(academicService.addResource(resource));
    }

    @PostMapping("/jobs")
    public ResponseEntity<Job> addJob(@RequestBody Job job) {
        return ResponseEntity.ok(jobService.saveJob(job));
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<Map<String, String>> deleteJob(@PathVariable String id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok(Map.of("message", "Job deleted successfully"));
    }

    @PostMapping("/placement-resources")
    public ResponseEntity<PlacementResource> addPlacementResource(@RequestBody PlacementResource resource) {
        return ResponseEntity.ok(placementService.addResource(resource));
    }
}
