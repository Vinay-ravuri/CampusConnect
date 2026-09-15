package com.campusconnect.controller;

import com.campusconnect.service.DashboardService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<?> getDashboard(@AuthenticationPrincipal String userEmail) {
        if (userEmail == null || userEmail.isBlank() || "anonymousUser".equalsIgnoreCase(userEmail)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Unauthorized. Please log in to access your student dashboard."));
        }

        Map<String, Object> data = dashboardService.getDashboardData(userEmail);
        return ResponseEntity.ok(data);
    }
}
