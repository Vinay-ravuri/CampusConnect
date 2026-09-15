package com.campusconnect.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "regulations")
public class Regulation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code; // "JNTUK", "AU", "UNI"

    @Column(nullable = false)
    private String displayName;

    @Column(length = 1000)
    private String description;

    private boolean active = true;

    public Regulation() {}

    public Regulation(String code, String displayName, String description) {
        this.code = code;
        this.displayName = displayName;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
