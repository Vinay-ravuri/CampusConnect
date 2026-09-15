package com.campusconnect.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cc_placement_questions")
public class PlacementQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String category; // "CODING", "SQL", "CORE_CS", "APTITUDE", "INTERVIEW"

    private String trackSlug; // e.g. "dsa", "sql", "dbms", "os", "cn", "quant"

    private String difficulty; // "Easy", "Medium", "Hard"

    @Column(length = 2000)
    private String description;

    @Column(length = 1000)
    private String sampleInput;

    @Column(length = 1000)
    private String sampleOutput;

    @Column(length = 3000)
    private String solutionNotes;

    @ElementCollection
    private List<String> companies = new ArrayList<>();

    private Integer displayOrder = 0;

    public PlacementQuestion() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getTrackSlug() { return trackSlug; }
    public void setTrackSlug(String trackSlug) { this.trackSlug = trackSlug; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSampleInput() { return sampleInput; }
    public void setSampleInput(String sampleInput) { this.sampleInput = sampleInput; }

    public String getSampleOutput() { return sampleOutput; }
    public void setSampleOutput(String sampleOutput) { this.sampleOutput = sampleOutput; }

    public String getSolutionNotes() { return solutionNotes; }
    public void setSolutionNotes(String solutionNotes) { this.solutionNotes = solutionNotes; }

    public List<String> getCompanies() { return companies; }
    public void setCompanies(List<String> companies) { this.companies = companies; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
}
