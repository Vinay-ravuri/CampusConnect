package com.campusconnect.repository;

import com.campusconnect.entity.SkillAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SkillAssessmentRepository extends JpaRepository<SkillAssessment, Long> {
    List<SkillAssessment> findByUserEmailOrderByCreatedAtDesc(String userEmail);
}
