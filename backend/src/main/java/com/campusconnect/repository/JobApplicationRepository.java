package com.campusconnect.repository;

import com.campusconnect.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByUserEmailOrderByAppliedAtDesc(String userEmail);
    Optional<JobApplication> findByUserEmailAndJobId(String userEmail, String jobId);
    boolean existsByUserEmailAndJobId(String userEmail, String jobId);
}
