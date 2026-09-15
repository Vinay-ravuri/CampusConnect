package com.campusconnect.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cc_placement_tracks")
public class PlacementTrack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String slug; // e.g. "dsa", "dbms", "sql", "core-cs", "dev", "aptitude"

    @Column(nullable = false)
    private String title;

    private String subtitle;

    private String category; // "DSA", "CORE_CS", "DEV", "APTITUDE", "INTERVIEW", "COMPANY"

    private String stage; // "FOUNDATION", "CORE_CS", "DSA", "DEVELOPMENT", "PRACTICE", "INTERVIEW", "COMPANY_PREP"

    @Column(length = 1000)
    private String description;

    private String difficulty; // "Beginner → Advanced"

    private String estimatedHours;

    private String icon;

    private String color;

    private String lightColor;

    private Integer displayOrder = 0;

    private Boolean active = true;

    @ElementCollection
    private List<String> targetCompanies = new ArrayList<>();

    @OneToMany(mappedBy = "track", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("displayOrder ASC")
    @JsonManagedReference
    private List<PlacementModule> modules = new ArrayList<>();

    public PlacementTrack() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getEstimatedHours() { return estimatedHours; }
    public void setEstimatedHours(String estimatedHours) { this.estimatedHours = estimatedHours; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getLightColor() { return lightColor; }
    public void setLightColor(String lightColor) { this.lightColor = lightColor; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public List<String> getTargetCompanies() { return targetCompanies; }
    public void setTargetCompanies(List<String> targetCompanies) { this.targetCompanies = targetCompanies; }

    public List<PlacementModule> getModules() { return modules; }
    public void setModules(List<PlacementModule> modules) { this.modules = modules; }
}
