package com.campusconnect.repository;

import com.campusconnect.entity.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface JobRepository extends JpaRepository<Job, String> {

    @Query("SELECT j FROM Job j WHERE j.active = true " +
           "AND (:category IS NULL OR :category = 'ALL' OR j.category = :category) " +
           "AND (:type IS NULL OR :type = 'ALL' OR j.type = :type) " +
           "AND (:experience IS NULL OR :experience = 'ALL' OR j.experience = :experience) " +
           "AND (:batch IS NULL OR :batch = 'ALL' OR j.batch = :batch) " +
           "AND (:workMode IS NULL OR :workMode = 'ALL' OR j.workMode = :workMode) " +
           "AND (:search IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "     OR LOWER(j.company) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "     OR LOWER(j.shortDesc) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Job> filterJobs(
            @Param("search") String search,
            @Param("category") String category,
            @Param("type") String type,
            @Param("experience") String experience,
            @Param("batch") String batch,
            @Param("workMode") String workMode,
            Pageable pageable
    );
}
