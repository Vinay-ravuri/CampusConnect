package com.campusconnect.repository;

import com.campusconnect.entity.PlacementTopic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlacementTopicRepository extends JpaRepository<PlacementTopic, Long> {
    List<PlacementTopic> findByModuleIdOrderByDisplayOrderAsc(Long moduleId);
    long countByModuleTrackSlug(String slug);
}
