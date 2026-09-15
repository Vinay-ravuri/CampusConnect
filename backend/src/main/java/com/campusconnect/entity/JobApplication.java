package com.campusconnect.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cc_job_applications", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_email", "job_id"})
})
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @Column(name = "job_id", nullable = false)
    private String jobId;

    private String studentName;
    private String studentEmail;
    private String resumeUrl;

    @Column(length = 2000)
    private String coverNote;

    @Column(nullable = false)
    private String status = "APPLIED"; // "APPLIED", "SCREENING", "INTERVIEW", "OFFER", "REJECTED", "WITHDRAWN"

    private LocalDateTime appliedAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public JobApplication() {}

    public JobApplication(String userEmail, String jobId, String studentName, String studentEmail, String resumeUrl, String coverNote) {
        this.userEmail = userEmail;
        this.jobId = jobId;
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.resumeUrl = resumeUrl;
        this.coverNote = coverNote;
        this.status = "APPLIED";
        this.appliedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getJobId() { return jobId; }
    public void setJobId(String jobId) { this.jobId = jobId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }

    public String getCoverNote() { return coverNote; }
    public void setCoverNote(String coverNote) { this.coverNote = coverNote; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
