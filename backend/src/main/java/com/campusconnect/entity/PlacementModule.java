package com.campusconnect.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cc_placement_modules")
public class PlacementModule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "track_id", nullable = false)
    @JsonBackReference
    private PlacementTrack track;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    private Integer displayOrder = 0;

    @OneToMany(mappedBy = "module", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("displayOrder ASC")
    @JsonManagedReference
    private List<PlacementTopic> topics = new ArrayList<>();

    public PlacementModule() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PlacementTrack getTrack() { return track; }
    public void setTrack(PlacementTrack track) { this.track = track; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }

    public List<PlacementTopic> getTopics() { return topics; }
    public void setTopics(List<PlacementTopic> topics) { this.topics = topics; }
}
