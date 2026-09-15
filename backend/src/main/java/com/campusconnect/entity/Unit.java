package com.campusconnect.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "units")
public class Unit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int unitNum; // 1, 2, 3, 4, 5
    private String title;

    @Column(length = 1000)
    private String description;

    private Long subjectId;

    public Unit() {}

    public Unit(int unitNum, String title, String description, Long subjectId) {
        this.unitNum = unitNum;
        this.title = title;
        this.description = description;
        this.subjectId = subjectId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public int getUnitNum() { return unitNum; }
    public void setUnitNum(int unitNum) { this.unitNum = unitNum; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
}
