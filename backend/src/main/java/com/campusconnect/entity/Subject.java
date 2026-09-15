package com.campusconnect.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "subjects")
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String regulationCode; // "JNTUK", "AU", "UNI"

    @Column(name = "academic_year")
    private String year; // "1st Year", "2nd Year", "3rd Year", "4th Year"

    private String semester; // "Sem 1", "Sem 2"
    private String branch; // "CSE", "IT", "ECE", "EEE", "Mech", "Civil"
    private String regulationTag; // "R23", "R20", "R19"

    private boolean active = true;

    public Subject() {}

    public Subject(String name, String regulationCode, String year, String semester, String branch, String regulationTag) {
        this.name = name;
        this.regulationCode = regulationCode;
        this.year = year;
        this.semester = semester;
        this.branch = branch;
        this.regulationTag = regulationTag;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRegulationCode() { return regulationCode; }
    public void setRegulationCode(String regulationCode) { this.regulationCode = regulationCode; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public String getRegulationTag() { return regulationTag; }
    public void setRegulationTag(String regulationTag) { this.regulationTag = regulationTag; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
