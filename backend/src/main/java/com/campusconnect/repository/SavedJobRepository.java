package com.campusconnect.repository;

import com.campusconnect.entity.SavedJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    List<SavedJob> findByUserEmailOrderBySavedAtDesc(String userEmail);
    Optional<SavedJob> findByUserEmailAndJobId(String userEmail, String jobId);
    boolean existsByUserEmailAndJobId(String userEmail, String jobId);
    void deleteByUserEmailAndJobId(String userEmail, String jobId);
}
