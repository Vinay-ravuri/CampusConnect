package com.campusconnect.repository;

import com.campusconnect.entity.PlacementProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlacementProgressRepository extends JpaRepository<PlacementProgress, Long> {
    List<PlacementProgress> findByUserEmail(String userEmail);
    List<PlacementProgress> findByUserEmailAndTrackSlug(String userEmail, String trackSlug);
    Optional<PlacementProgress> findByUserEmailAndTopicId(String userEmail, Long topicId);
    long countByUserEmailAndStatus(String userEmail, String status);
    long countByUserEmailAndTrackSlugAndStatus(String userEmail, String trackSlug, String status);
}
