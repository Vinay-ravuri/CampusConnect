package com.campusconnect.controller;

import com.campusconnect.entity.PlacementResource;
import com.campusconnect.service.PlacementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PlacementController {

    private final PlacementService placementService;

    public PlacementController(PlacementService placementService) {
        this.placementService = placementService;
    }

    @GetMapping("/placement-resources")
    public ResponseEntity<List<PlacementResource>> getPlacementResources(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(placementService.getAllResources(category));
    }
}
