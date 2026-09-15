package com.campusconnect.service;

import com.campusconnect.entity.Job;
import com.campusconnect.entity.JobApplication;
import com.campusconnect.entity.SavedJob;
import com.campusconnect.repository.JobApplicationRepository;
import com.campusconnect.repository.JobRepository;
import com.campusconnect.repository.SavedJobRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final SavedJobRepository savedJobRepository;
    private final JobApplicationRepository applicationRepository;

    public JobService(JobRepository jobRepository,
                      SavedJobRepository savedJobRepository,
                      JobApplicationRepository applicationRepository) {
        this.jobRepository = jobRepository;
        this.savedJobRepository = savedJobRepository;
        this.applicationRepository = applicationRepository;
    }

    public Page<Job> getJobs(String search, String category, String type, String experience,
                            String batch, String workMode, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return jobRepository.filterJobs(search, category, type, experience, batch, workMode, pageable);
    }

    public Optional<Job> getJobById(String id) {
        return jobRepository.findById(id);
    }

    public Job saveJob(Job job) {
        return jobRepository.save(job);
    }

    public void deleteJob(String id) {
        jobRepository.deleteById(id);
    }

    @Transactional
    public Map<String, Object> toggleSaveJob(String userEmail, String jobId) {
        Optional<SavedJob> existing = savedJobRepository.findByUserEmailAndJobId(userEmail, jobId);
        boolean isSaved;
        if (existing.isPresent()) {
            savedJobRepository.deleteByUserEmailAndJobId(userEmail, jobId);
            isSaved = false;
        } else {
            savedJobRepository.save(new SavedJob(userEmail, jobId));
            isSaved = true;
        }
        return Map.of("jobId", jobId, "saved", isSaved);
    }

    public Set<String> getSavedJobIdsForUser(String userEmail) {
        return savedJobRepository.findByUserEmailOrderBySavedAtDesc(userEmail).stream()
                .map(SavedJob::getJobId)
                .collect(Collectors.toSet());
    }

    public List<Job> getSavedJobsForUser(String userEmail) {
        List<SavedJob> savedList = savedJobRepository.findByUserEmailOrderBySavedAtDesc(userEmail);
        List<Job> result = new ArrayList<>();
        for (SavedJob sj : savedList) {
            jobRepository.findById(sj.getJobId()).ifPresent(result::add);
        }
        return result;
    }

    @Transactional
    public Map<String, Object> applyForJob(String userEmail, String jobId, Map<String, String> payload) {
        Optional<Job> jobOpt = jobRepository.findById(jobId);
        if (jobOpt.isEmpty()) {
            throw new IllegalArgumentException("Job listing not found with id: " + jobId);
        }

        Optional<JobApplication> existing = applicationRepository.findByUserEmailAndJobId(userEmail, jobId);
        if (existing.isPresent()) {
            JobApplication app = existing.get();
            return Map.of(
                    "id", app.getId(),
                    "jobId", jobId,
                    "status", app.getStatus(),
                    "message", "You have already applied for this role."
            );
        }

        String studentName = payload.getOrDefault("studentName", "");
        String studentEmail = payload.getOrDefault("studentEmail", userEmail);
        String resumeUrl = payload.getOrDefault("resumeUrl", "");
        String coverNote = payload.getOrDefault("coverNote", "");

        JobApplication app = new JobApplication(userEmail, jobId, studentName, studentEmail, resumeUrl, coverNote);
        applicationRepository.save(app);

        return Map.of(
                "id", app.getId(),
                "jobId", jobId,
                "status", app.getStatus(),
                "appliedAt", app.getAppliedAt().toString(),
                "message", "Application submitted successfully!"
        );
    }

    public List<Map<String, Object>> getUserApplications(String userEmail) {
        List<JobApplication> apps = applicationRepository.findByUserEmailOrderByAppliedAtDesc(userEmail);
        List<Map<String, Object>> result = new ArrayList<>();

        for (JobApplication app : apps) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", app.getId());
            item.put("jobId", app.getJobId());
            item.put("status", app.getStatus());
            item.put("appliedAt", app.getAppliedAt());
            item.put("updatedAt", app.getUpdatedAt());
            item.put("coverNote", app.getCoverNote());

            jobRepository.findById(app.getJobId()).ifPresent(job -> {
                item.put("jobTitle", job.getTitle());
                item.put("company", job.getCompany());
                item.put("logo", job.getLogo());
                item.put("color", job.getColor());
                item.put("bgColor", job.getBgColor());
                item.put("location", job.getLocation());
                item.put("workMode", job.getWorkMode());
                item.put("type", job.getType());
                item.put("salary", job.getSalary());
            });

            result.add(item);
        }
        return result;
    }
}
