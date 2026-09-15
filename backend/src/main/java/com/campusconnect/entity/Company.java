package com.campusconnect.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "companies")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String fullName;
    private String logo;
    private String color;
    private String bgColor;
    private String industry;
    private String website;
    private boolean verified = true;

    public Company() {}

    public Company(String name, String fullName, String logo, String color, String bgColor, String industry, String website) {
        this.name = name;
        this.fullName = fullName;
        this.logo = logo;
        this.color = color;
        this.bgColor = bgColor;
        this.industry = industry;
        this.website = website;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getLogo() { return logo; }
    public void setLogo(String logo) { this.logo = logo; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getBgColor() { return bgColor; }
    public void setBgColor(String bgColor) { this.bgColor = bgColor; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
}
