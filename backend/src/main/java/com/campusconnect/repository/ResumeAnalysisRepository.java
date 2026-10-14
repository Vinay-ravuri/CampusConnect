package com.campusconnect.repository;

import com.campusconnect.entity.ResumeAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResumeAnalysisRepository extends JpaRepository<ResumeAnalysis, Long> {
    List<ResumeAnalysis> findByUserEmailOrderByCreatedAtDesc(String userEmail);
}
