package com.campusconnect.controller;

import com.campusconnect.service.CareerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/career")
public class CareerController {

    private final CareerService careerService;

    public CareerController(CareerService careerService) {
        this.careerService = careerService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<Map<String, Object>> analyzeCareer(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(careerService.analyzeCareer(payload));
    }
}
