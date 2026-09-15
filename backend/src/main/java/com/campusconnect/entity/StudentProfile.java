package com.campusconnect.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "student_profiles")
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String userEmail;

    private String name;
    private String university; // e.g. "JNTUK", "AU"
    private String college;
    private String branch; // e.g. "CSE", "IT", "ECE"
    private String graduationYear; // e.g. "2027", "2026"
    private String semester; // e.g. "Sem 1", "Sem 2"
    private Double cgpa;
    private String targetRole; // e.g. "Java Developer", "Full Stack"
    private String resumeUrl;

    @ElementCollection
    private List<String> skills = new ArrayList<>();

    public StudentProfile() {}

    public StudentProfile(String userEmail, String name) {
        this.userEmail = userEmail;
        this.name = name;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getUniversity() { return university; }
    public void setUniversity(String university) { this.university = university; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public String getGraduationYear() { return graduationYear; }
    public void setGraduationYear(String graduationYear) { this.graduationYear = graduationYear; }

    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }

    public Double getCgpa() { return cgpa; }
    public void setCgpa(Double cgpa) { this.cgpa = cgpa; }

    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }

    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }
}
