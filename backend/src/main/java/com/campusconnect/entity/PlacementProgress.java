package com.campusconnect.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cc_placement_progress", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_email", "topic_id"})
})
public class PlacementProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @Column(name = "track_slug", nullable = false)
    private String trackSlug;

    @Column(name = "topic_id", nullable = false)
    private Long topicId;

    @Column(nullable = false)
    private String status; // "NOT_STARTED", "IN_PROGRESS", "COMPLETED"

    private LocalDateTime completedAt;

    public PlacementProgress() {}

    public PlacementProgress(String userEmail, String trackSlug, Long topicId, String status) {
        this.userEmail = userEmail;
        this.trackSlug = trackSlug;
        this.topicId = topicId;
        this.status = status;
        this.completedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getTrackSlug() { return trackSlug; }
    public void setTrackSlug(String trackSlug) { this.trackSlug = trackSlug; }

    public Long getTopicId() { return topicId; }
    public void setTopicId(Long topicId) { this.topicId = topicId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
