package com.campusconnect.controller;

import com.campusconnect.entity.StudentProfile;
import com.campusconnect.repository.StudentProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
public class StudentProfileController {

    private final StudentProfileRepository studentProfileRepository;

    public StudentProfileController(StudentProfileRepository studentProfileRepository) {
        this.studentProfileRepository = studentProfileRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<StudentProfile> getMyProfile(@AuthenticationPrincipal String userEmail) {
        StudentProfile profile = studentProfileRepository.findByUserEmail(userEmail)
                .orElseGet(() -> new StudentProfile(userEmail, userEmail.split("@")[0]));
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/me")
    public ResponseEntity<StudentProfile> updateMyProfile(@AuthenticationPrincipal String userEmail, @RequestBody StudentProfile req) {
        StudentProfile profile = studentProfileRepository.findByUserEmail(userEmail)
                .orElseGet(() -> new StudentProfile(userEmail, req.getName() != null ? req.getName() : userEmail.split("@")[0]));

        if (req.getName() != null) profile.setName(req.getName());
        if (req.getUniversity() != null) profile.setUniversity(req.getUniversity());
        if (req.getCollege() != null) profile.setCollege(req.getCollege());
        if (req.getBranch() != null) profile.setBranch(req.getBranch());
        if (req.getGraduationYear() != null) profile.setGraduationYear(req.getGraduationYear());
        if (req.getSemester() != null) profile.setSemester(req.getSemester());
        if (req.getCgpa() != null) profile.setCgpa(req.getCgpa());
        if (req.getTargetRole() != null) profile.setTargetRole(req.getTargetRole());
        if (req.getResumeUrl() != null) profile.setResumeUrl(req.getResumeUrl());
        if (req.getSkills() != null) profile.setSkills(req.getSkills());

        return ResponseEntity.ok(studentProfileRepository.save(profile));
    }
}
