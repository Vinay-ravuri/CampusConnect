package com.campusconnect.service;

import com.campusconnect.entity.PlacementResource;
import com.campusconnect.repository.PlacementResourceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlacementService {

    private final PlacementResourceRepository placementResourceRepository;

    public PlacementService(PlacementResourceRepository placementResourceRepository) {
        this.placementResourceRepository = placementResourceRepository;
    }

    public List<PlacementResource> getAllResources(String category) {
        if (category != null && !category.isBlank() && !"ALL".equalsIgnoreCase(category)) {
            return placementResourceRepository.findByCategory(category);
        }
        return placementResourceRepository.findAll();
    }

    public PlacementResource addResource(PlacementResource resource) {
        return placementResourceRepository.save(resource);
    }
}
