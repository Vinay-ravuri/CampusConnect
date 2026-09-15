package com.campusconnect.repository;

import com.campusconnect.entity.PlacementModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlacementModuleRepository extends JpaRepository<PlacementModule, Long> {
    List<PlacementModule> findByTrackIdOrderByDisplayOrderAsc(Long trackId);
}
