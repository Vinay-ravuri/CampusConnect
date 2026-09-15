package com.campusconnect.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "placement_resources")
public class PlacementResource {

    @Id
    private String id; // "dsa", "java", "quant", etc.

    @Column(nullable = false)
    private String category; // "DSA", "LANGUAGES", "WEBDEV", "APTITUDE", "PYQ"

    private String icon;
    private String badge;
    private String badgeColor;

    @Column(nullable = false)
    private String title;

    private String subtitle;

    @Column(name = "desc_text", length = 1000)
    private String desc;

    @ElementCollection
    private List<String> topics = new ArrayList<>();

    private String difficulty;
    private String hours;
    private String problems;

    @ElementCollection
    private List<String> companies = new ArrayList<>();

    private String color;
    private String lightColor;

    public PlacementResource() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }

    public String getBadgeColor() { return badgeColor; }
    public void setBadgeColor(String badgeColor) { this.badgeColor = badgeColor; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }

    public String getDesc() { return desc; }
    public void setDesc(String desc) { this.desc = desc; }

    public List<String> getTopics() { return topics; }
    public void setTopics(List<String> topics) { this.topics = topics; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getHours() { return hours; }
    public void setHours(String hours) { this.hours = hours; }

    public String getProblems() { return problems; }
    public void setProblems(String problems) { this.problems = problems; }

    public List<String> getCompanies() { return companies; }
    public void setCompanies(List<String> companies) { this.companies = companies; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getLightColor() { return lightColor; }
    public void setLightColor(String lightColor) { this.lightColor = lightColor; }
}
