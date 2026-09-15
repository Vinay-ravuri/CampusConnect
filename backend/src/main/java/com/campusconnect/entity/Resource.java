package com.campusconnect.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "resources")
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String type; // "PDF", "YOUTUBE", "IMPORTANT_QUESTION", "PREVIOUS_PAPER", "LAB_MANUAL", "NOTES", "REFERENCE", "EXTERNAL_LINK"

    private String url;
    private Long unitId;

    private boolean verified = true;
    private boolean active = true;

    public Resource() {}

    public Resource(String title, String description, String type, String url, Long unitId) {
        this.title = title;
        this.description = description;
        this.type = type;
        this.url = url;
        this.unitId = unitId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public Long getUnitId() { return unitId; }
    public void setUnitId(Long unitId) { this.unitId = unitId; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
