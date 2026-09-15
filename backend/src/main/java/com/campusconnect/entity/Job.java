package com.campusconnect.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
public class Job {

    @Id
    private String id; // "job-1", "job-2", etc.

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String company;

    private String logo;
    private String color;
    private String bgColor;

    private String location;
    private String workMode; // "Remote", "Hybrid", "On-site"
    private String type; // "Full Time", "Internship"
    private String category; // "SOFTWARE", "WEB", "JAVA", "PYTHON", "AIML", "CLOUD", "INTERNSHIP", "FRESHER"
    private String batch; // "2027", "2026", "2025"
    private String experience; // "Fresher", "0-1 Years", "1-2 Years"

    @ElementCollection
    private java.util.List<String> branch = new java.util.ArrayList<>();

    private String salary;
    private String postedDate;
    private String deadline;
    private boolean verified = true;
    private boolean active = true;

    @ElementCollection
    private java.util.List<String> skills = new java.util.ArrayList<>();

    @Column(length = 1000)
    private String shortDesc;

    @Column(length = 4000)
    private String description;

    @ElementCollection
    private java.util.List<String> responsibilities = new java.util.ArrayList<>();

    @ElementCollection
    private java.util.List<String> requirements = new java.util.ArrayList<>();

    private String externalUrl;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Job() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getLogo() { return logo; }
    public void setLogo(String logo) { this.logo = logo; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getBgColor() { return bgColor; }
    public void setBgColor(String bgColor) { this.bgColor = bgColor; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getWorkMode() { return workMode; }
    public void setWorkMode(String workMode) { this.workMode = workMode; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getBatch() { return batch; }
    public void setBatch(String batch) { this.batch = batch; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public java.util.List<String> getBranch() { return branch; }
    public void setBranch(java.util.List<String> branch) { this.branch = branch; }

    public String getSalary() { return salary; }
    public void setSalary(String salary) { this.salary = salary; }

    public String getPostedDate() { return postedDate; }
    public void setPostedDate(String postedDate) { this.postedDate = postedDate; }

    public String getDeadline() { return deadline; }
    public void setDeadline(String deadline) { this.deadline = deadline; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public java.util.List<String> getSkills() { return skills; }
    public void setSkills(java.util.List<String> skills) { this.skills = skills; }

    public String getShortDesc() { return shortDesc; }
    public void setShortDesc(String shortDesc) { this.shortDesc = shortDesc; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public java.util.List<String> getResponsibilities() { return responsibilities; }
    public void setResponsibilities(java.util.List<String> responsibilities) { this.responsibilities = responsibilities; }

    public java.util.List<String> getRequirements() { return requirements; }
    public void setRequirements(java.util.List<String> requirements) { this.requirements = requirements; }

    public String getExternalUrl() { return externalUrl; }
    public void setExternalUrl(String externalUrl) { this.externalUrl = externalUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
