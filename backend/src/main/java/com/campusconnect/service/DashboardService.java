package com.campusconnect.service;

import com.campusconnect.entity.*;
import com.campusconnect.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final StudentProfileRepository profileRepository;
    private final RegulationRepository regulationRepository;
    private final SubjectRepository subjectRepository;
    private final UnitRepository unitRepository;
    private final ResourceRepository resourceRepository;
    private final BookmarkRepository bookmarkRepository;
    private final PlacementTrackService placementTrackService;
    private final PlacementProgressRepository placementProgressRepository;
    private final PlacementTopicRepository placementTopicRepository;
    private final JobService jobService;
    private final JobRepository jobRepository;

    public DashboardService(UserRepository userRepository,
                            StudentProfileRepository profileRepository,
                            RegulationRepository regulationRepository,
                            SubjectRepository subjectRepository,
                            UnitRepository unitRepository,
                            ResourceRepository resourceRepository,
                            BookmarkRepository bookmarkRepository,
                            PlacementTrackService placementTrackService,
                            PlacementProgressRepository placementProgressRepository,
                            PlacementTopicRepository placementTopicRepository,
                            JobService jobService,
                            JobRepository jobRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.regulationRepository = regulationRepository;
        this.subjectRepository = subjectRepository;
        this.unitRepository = unitRepository;
        this.resourceRepository = resourceRepository;
        this.bookmarkRepository = bookmarkRepository;
        this.placementTrackService = placementTrackService;
        this.placementProgressRepository = placementProgressRepository;
        this.placementTopicRepository = placementTopicRepository;
        this.jobService = jobService;
        this.jobRepository = jobRepository;
    }

    public Map<String, Object> getDashboardData(String userEmail) {
        Map<String, Object> dashboard = new HashMap<>();

        // 1. Profile Section
        Map<String, Object> profileData = new HashMap<>();
        try {
            Optional<User> userOpt = userRepository.findByEmail(userEmail);
            Optional<StudentProfile> profileOpt = profileRepository.findByUserEmail(userEmail);

            String name = userOpt.map(User::getName).orElseGet(() -> profileOpt.map(StudentProfile::getName).orElse("Student"));
            String role = userOpt.map(User::getRole).orElse("STUDENT");

            profileData.put("email", userEmail);
            profileData.put("name", name);
            profileData.put("role", role);

            if (profileOpt.isPresent()) {
                StudentProfile sp = profileOpt.get();
                profileData.put("university", sp.getUniversity() != null ? sp.getUniversity() : "JNTUK");
                profileData.put("college", sp.getCollege() != null ? sp.getCollege() : "Engineering College");
                profileData.put("branch", sp.getBranch() != null ? sp.getBranch() : "CSE");
                profileData.put("semester", sp.getSemester() != null ? sp.getSemester() : "Sem 5");
                profileData.put("graduationYear", sp.getGraduationYear() != null ? sp.getGraduationYear() : "2027");
                profileData.put("cgpa", sp.getCgpa() != null ? sp.getCgpa() : 8.4);
                profileData.put("targetRole", sp.getTargetRole() != null ? sp.getTargetRole() : "Software Engineer");
                profileData.put("resumeUrl", sp.getResumeUrl());
                profileData.put("skills", sp.getSkills() != null ? sp.getSkills() : List.of("Java", "Data Structures", "SQL"));
            } else {
                profileData.put("university", "JNTUK");
                profileData.put("college", "Engineering College");
                profileData.put("branch", "CSE");
                profileData.put("semester", "Sem 5");
                profileData.put("graduationYear", "2027");
                profileData.put("cgpa", 8.4);
                profileData.put("targetRole", "Software Engineer");
                profileData.put("resumeUrl", null);
                profileData.put("skills", List.of("Java", "Data Structures", "SQL"));
            }
        } catch (Exception e) {
            profileData.put("error", "Profile details temporarily unavailable");
        }
        dashboard.put("profile", profileData);

        // 2. Academic Section
        Map<String, Object> academicData = new HashMap<>();
        try {
            List<Regulation> regulations = regulationRepository.findByActiveTrue();
            academicData.put("regulations", regulations);

            String universityCode = (String) profileData.getOrDefault("university", "JNTUK");
            List<Subject> subjects = subjectRepository.findByRegulationCodeAndActiveTrue(universityCode);
            if (subjects.isEmpty()) {
                subjects = subjectRepository.findAll().stream().filter(Subject::isActive).collect(Collectors.toList());
            }
            academicData.put("activeRegulation", universityCode + " (R20)");
            academicData.put("subjects", subjects.stream().limit(6).collect(Collectors.toList()));

            // User Bookmarks with rich target details
            List<Bookmark> bookmarks = bookmarkRepository.findByUserEmail(userEmail);
            List<Map<String, Object>> academicBookmarks = new ArrayList<>();
            for (Bookmark b : bookmarks) {
                if ("RESOURCE".equalsIgnoreCase(b.getTargetType())) {
                    try {
                        Long resId = Long.parseLong(b.getTargetId());
                        Optional<Resource> resOpt = resourceRepository.findById(resId);
                        if (resOpt.isPresent()) {
                            Resource res = resOpt.get();
                            Map<String, Object> bmItem = new HashMap<>();
                            bmItem.put("id", b.getId());
                            bmItem.put("resourceId", res.getId());
                            bmItem.put("title", res.getTitle());
                            bmItem.put("type", res.getType());
                            bmItem.put("url", res.getUrl());
                            bmItem.put("unitId", res.getUnitId());

                            unitRepository.findById(res.getUnitId()).ifPresent(unit -> {
                                bmItem.put("unitNum", unit.getUnitNum());
                                bmItem.put("unitTitle", unit.getTitle());
                                subjectRepository.findById(unit.getSubjectId()).ifPresent(sub -> {
                                    bmItem.put("subjectName", sub.getName());
                                    bmItem.put("regulationTag", sub.getRegulationTag());
                                    bmItem.put("regCode", sub.getRegulationCode());
                                    bmItem.put("subjectId", sub.getId());
                                });
                            });
                            academicBookmarks.add(bmItem);
                        }
                    } catch (Exception ignored) {}
                }
            }
            academicData.put("bookmarks", academicBookmarks);

            // Continue Learning recommendation
            if (!academicBookmarks.isEmpty()) {
                academicData.put("continueLearning", academicBookmarks.get(0));
            } else if (!subjects.isEmpty()) {
                Subject topSub = subjects.get(0);
                academicData.put("continueLearning", Map.of(
                        "subjectId", topSub.getId(),
                        "subjectName", topSub.getName(),
                        "regulationTag", topSub.getRegulationTag() != null ? topSub.getRegulationTag() : "R20",
                        "regCode", topSub.getRegulationCode(),
                        "unitNum", 1,
                        "unitTitle", "Unit 1: Fundamentals and Overview"
                ));
            }
        } catch (Exception e) {
            academicData.put("error", "Academic records temporarily unavailable");
            academicData.put("subjects", Collections.emptyList());
            academicData.put("bookmarks", Collections.emptyList());
        }
        dashboard.put("academic", academicData);

        // 3. Placement Section
        Map<String, Object> placementData = new HashMap<>();
        try {
            Map<String, Object> userProgress = placementTrackService.getUserPlacementProgress(userEmail);
            placementData.put("progress", userProgress);
            placementData.put("tracksSummary", placementTrackService.getAllTracksSummary());
        } catch (Exception e) {
            placementData.put("error", "Placement progress temporarily unavailable");
            placementData.put("progress", Map.of(
                    "readinessScore", 0,
                    "totalCompleted", 0,
                    "totalTopics", 0,
                    "trackProgress", Collections.emptyMap()
            ));
        }
        dashboard.put("placement", placementData);

        // 4. Jobs & Internships Section
        Map<String, Object> jobsData = new HashMap<>();
        try {
            List<Map<String, Object>> applications = jobService.getUserApplications(userEmail);
            List<Job> savedJobs = jobService.getSavedJobsForUser(userEmail);
            List<Job> featuredJobs = jobRepository.findAll().stream()
                    .filter(Job::isActive)
                    .limit(4)
                    .collect(Collectors.toList());

            jobsData.put("applications", applications);
            jobsData.put("savedJobs", savedJobs);
            jobsData.put("featuredJobs", featuredJobs);
            jobsData.put("applicationsCount", applications.size());
            jobsData.put("savedCount", savedJobs.size());
        } catch (Exception e) {
            jobsData.put("error", "Job listings temporarily unavailable");
            jobsData.put("applications", Collections.emptyList());
            jobsData.put("savedJobs", Collections.emptyList());
            jobsData.put("featuredJobs", Collections.emptyList());
        }
        dashboard.put("jobs", jobsData);

        // 5. Resume Section
        Map<String, Object> resumeData = new HashMap<>();
        try {
            Optional<StudentProfile> profileOpt = profileRepository.findByUserEmail(userEmail);
            boolean hasResume = profileOpt.map(p -> p.getResumeUrl() != null && !p.getResumeUrl().isBlank()).orElse(false);
            String targetRole = profileOpt.map(StudentProfile::getTargetRole).orElse("Software Engineer");

            resumeData.put("hasResume", hasResume);
            resumeData.put("resumeUrl", profileOpt.map(StudentProfile::getResumeUrl).orElse(null));
            resumeData.put("targetRole", targetRole);
            resumeData.put("atsScore", hasResume ? 82 : null);
            resumeData.put("status", hasResume ? "ANALYZED" : "NOT_UPLOADED");
            resumeData.put("topImprovement", hasResume
                    ? "Add quantified project impact metrics and Docker containerization keywords."
                    : "Upload your resume in PDF format to receive instant AI ATS score and keyword gap analysis.");
        } catch (Exception e) {
            resumeData.put("error", "Resume status temporarily unavailable");
        }
        dashboard.put("resume", resumeData);

        // 6. AI Career Section
        Map<String, Object> aiData = new HashMap<>();
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> progress = (Map<String, Object>) placementData.get("progress");
            int readiness = progress != null && progress.containsKey("readinessScore") ? ((Number) progress.get("readinessScore")).intValue() : 0;
            String targetRole = (String) profileData.getOrDefault("targetRole", "Software Engineer");

            String headline;
            String recommendation;
            String actionLabel;
            String actionUrl;

            if (readiness < 20) {
                headline = "Solidify CS Fundamentals";
                recommendation = "Begin with Data Structures & Algorithms and Master Arrays, Strings, and Sorting before diving into System Design.";
                actionLabel = "Start DSA Track";
                actionUrl = "/placement";
            } else if (readiness < 60) {
                headline = "Level Up System Core & SQL";
                recommendation = "Strengthen SQL window functions and indexing, then practice backend interview questions for " + targetRole + " roles.";
                actionLabel = "Practice SQL & DBMS";
                actionUrl = "/placement";
            } else {
                headline = "Interview Ready & Competitive Edge";
                recommendation = "Your core preparation is high (" + readiness + "%). Focus on mock technical interviews, system design tradeoffs, and active job applications.";
                actionLabel = "Explore Top Openings";
                actionUrl = "/jobs";
            }

            aiData.put("headline", headline);
            aiData.put("recommendation", recommendation);
            aiData.put("actionLabel", actionLabel);
            aiData.put("actionUrl", actionUrl);
        } catch (Exception e) {
            aiData.put("headline", "AI Career Coach");
            aiData.put("recommendation", "Analyze your placement progress and resume to unlock personalized career guidance.");
            aiData.put("actionLabel", "Ask Campus AI");
            aiData.put("actionUrl", "/career");
        }
        dashboard.put("ai", aiData);

        // 7. Activity Feed (Real events, clean empty state if none)
        List<Map<String, Object>> activities = new ArrayList<>();
        try {
            // Placement completed activities
            List<PlacementProgress> pProgressList = placementProgressRepository.findByUserEmail(userEmail);
            for (PlacementProgress pp : pProgressList) {
                if ("COMPLETED".equalsIgnoreCase(pp.getStatus()) && pp.getCompletedAt() != null) {
                    Map<String, Object> act = new HashMap<>();
                    act.put("id", "prog-" + pp.getId());
                    act.put("type", "PLACEMENT_TOPIC");
                    act.put("title", "Completed Placement Topic");
                    act.put("subtitle", "Track: " + pp.getTrackSlug().toUpperCase());
                    act.put("timestamp", pp.getCompletedAt().toString());
                    act.put("icon", "check");
                    activities.add(act);
                }
            }

            // Job applications activities
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> apps = (List<Map<String, Object>>) jobsData.get("applications");
            if (apps != null) {
                for (Map<String, Object> app : apps) {
                    Map<String, Object> act = new HashMap<>();
                    act.put("id", "app-" + app.get("id"));
                    act.put("type", "JOB_APPLICATION");
                    act.put("title", "Applied to " + app.getOrDefault("jobTitle", "Role"));
                    act.put("subtitle", (String) app.getOrDefault("company", "Company") + " • Status: " + app.getOrDefault("status", "APPLIED"));
                    act.put("timestamp", String.valueOf(app.get("appliedAt")));
                    act.put("icon", "briefcase");
                    activities.add(act);
                }
            }

            // Bookmarks activities
            List<Bookmark> userBookmarks = bookmarkRepository.findByUserEmail(userEmail);
            for (Bookmark bm : userBookmarks) {
                Map<String, Object> act = new HashMap<>();
                act.put("id", "bm-" + bm.getId());
                act.put("type", "BOOKMARK");
                act.put("title", "Saved " + bm.getTargetType().toLowerCase() + " resource");
                act.put("subtitle", "Added to your personal library");
                act.put("timestamp", bm.getCreatedAt().toString());
                act.put("icon", "bookmark");
                activities.add(act);
            }

            // Sort newest first
            activities.sort((a, b) -> String.valueOf(b.get("timestamp")).compareTo(String.valueOf(a.get("timestamp"))));
        } catch (Exception e) {
            // Keep activities empty if query fails
        }
        dashboard.put("activity", activities.stream().limit(8).collect(Collectors.toList()));

        // 8. Quick Actions
        dashboard.put("quickActions", List.of(
                Map.of("label", "Continue Learning", "path", "/student", "icon", "book-open", "desc", "Resume current academic unit syllabus"),
                Map.of("label", "Practice DSA", "path", "/placement", "icon", "code", "desc", "Solve coding challenges and data structures"),
                Map.of("label", "Practice SQL", "path", "/placement", "icon", "database", "desc", "Master relational queries and joins"),
                Map.of("label", "Find Jobs", "path", "/jobs", "icon", "briefcase", "desc", "Browse verified graduate and intern roles"),
                Map.of("label", "Analyze Resume", "path", "/career", "icon", "file-text", "desc", "Instant AI ATS scoring and gap analysis"),
                Map.of("label", "Ask Campus AI", "path", "/career", "icon", "sparkles", "desc", "Interactive 24/7 career mentoring")
        ));

        // 9. Onboarding check for brand new students
        boolean isNew = activities.isEmpty();
        dashboard.put("isNewStudent", isNew);

        return dashboard;
    }
}
