package com.campusconnect.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "cc_placement_topics")
public class PlacementTopic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "module_id", nullable = false)
    @JsonBackReference
    private PlacementModule module;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(name = "concept_summary", length = 2000)
    private String conceptSummary;

    private String practiceType; // "CONCEPT", "CODING", "SQL", "MCQ"

    private String difficulty; // "Easy", "Medium", "Hard"

    private Integer displayOrder = 0;

    public PlacementTopic() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PlacementModule getModule() { return module; }
    public void setModule(PlacementModule module) { this.module = module; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getConceptSummary() { return conceptSummary; }
    public void setConceptSummary(String conceptSummary) { this.conceptSummary = conceptSummary; }

    public String getPracticeType() { return practiceType; }
    public void setPracticeType(String practiceType) { this.practiceType = practiceType; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
}
