package com.campusconnect.controller;

import com.campusconnect.entity.Regulation;
import com.campusconnect.entity.Resource;
import com.campusconnect.entity.Subject;
import com.campusconnect.entity.Unit;
import com.campusconnect.service.AcademicService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class AcademicController {

    private final AcademicService academicService;

    public AcademicController(AcademicService academicService) {
        this.academicService = academicService;
    }

    @GetMapping("/regulations")
    public ResponseEntity<List<Regulation>> getRegulations() {
        return ResponseEntity.ok(academicService.getRegulations());
    }

    @GetMapping("/subjects/{regCode}")
    public ResponseEntity<List<Subject>> getSubjectsByRegulation(@PathVariable String regCode) {
        return ResponseEntity.ok(academicService.getSubjectsByRegulation(regCode));
    }

    @GetMapping("/subject/{id}")
    public ResponseEntity<Subject> getSubjectById(@PathVariable Long id) {
        return academicService.getSubjectById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/subjects/search")
    public ResponseEntity<List<Subject>> searchSubjects(@RequestParam String query) {
        return ResponseEntity.ok(academicService.searchSubjects(query));
    }

    @GetMapping("/units/{subjectId}")
    public ResponseEntity<List<Unit>> getUnitsBySubject(@PathVariable Long subjectId) {
        return ResponseEntity.ok(academicService.getUnitsBySubject(subjectId));
    }

    @GetMapping("/resources/{unitId}")
    public ResponseEntity<List<Resource>> getResourcesByUnit(@PathVariable Long unitId) {
        return ResponseEntity.ok(academicService.getResourcesByUnit(unitId));
    }
}
