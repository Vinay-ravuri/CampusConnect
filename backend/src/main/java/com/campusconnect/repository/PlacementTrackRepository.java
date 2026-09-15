package com.campusconnect.repository;

import com.campusconnect.entity.PlacementTrack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlacementTrackRepository extends JpaRepository<PlacementTrack, Long> {
    List<PlacementTrack> findByActiveTrueOrderByDisplayOrderAsc();
    Optional<PlacementTrack> findBySlugAndActiveTrue(String slug);
    List<PlacementTrack> findByCategoryAndActiveTrueOrderByDisplayOrderAsc(String category);
    List<PlacementTrack> findByStageAndActiveTrueOrderByDisplayOrderAsc(String stage);
}
