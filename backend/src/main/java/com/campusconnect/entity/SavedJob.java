package com.campusconnect.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cc_saved_jobs", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_email", "job_id"})
})
public class SavedJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @Column(name = "job_id", nullable = false)
    private String jobId;

    private LocalDateTime savedAt = LocalDateTime.now();

    public SavedJob() {}

    public SavedJob(String userEmail, String jobId) {
        this.userEmail = userEmail;
        this.jobId = jobId;
        this.savedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getJobId() { return jobId; }
    public void setJobId(String jobId) { this.jobId = jobId; }

    public LocalDateTime getSavedAt() { return savedAt; }
    public void setSavedAt(LocalDateTime savedAt) { this.savedAt = savedAt; }
}
