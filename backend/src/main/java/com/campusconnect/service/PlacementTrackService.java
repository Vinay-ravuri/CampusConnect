package com.campusconnect.service;

import com.campusconnect.entity.*;
import com.campusconnect.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PlacementTrackService {

    private final PlacementTrackRepository trackRepository;
    private final PlacementModuleRepository moduleRepository;
    private final PlacementTopicRepository topicRepository;
    private final PlacementQuestionRepository questionRepository;
    private final PlacementProgressRepository progressRepository;

    public PlacementTrackService(PlacementTrackRepository trackRepository,
                                 PlacementModuleRepository moduleRepository,
                                 PlacementTopicRepository topicRepository,
                                 PlacementQuestionRepository questionRepository,
                                 PlacementProgressRepository progressRepository) {
        this.trackRepository = trackRepository;
        this.moduleRepository = moduleRepository;
        this.topicRepository = topicRepository;
        this.questionRepository = questionRepository;
        this.progressRepository = progressRepository;
    }

    public List<Map<String, Object>> getAllTracksSummary() {
        List<PlacementTrack> tracks = trackRepository.findByActiveTrueOrderByDisplayOrderAsc();
        List<Map<String, Object>> result = new ArrayList<>();

        for (PlacementTrack track : tracks) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", track.getId());
            map.put("slug", track.getSlug());
            map.put("title", track.getTitle());
            map.put("subtitle", track.getSubtitle());
            map.put("category", track.getCategory());
            map.put("stage", track.getStage());
            map.put("description", track.getDescription());
            map.put("difficulty", track.getDifficulty());
            map.put("estimatedHours", track.getEstimatedHours());
            map.put("icon", track.getIcon());
            map.put("color", track.getColor());
            map.put("lightColor", track.getLightColor());
            map.put("targetCompanies", track.getTargetCompanies());
            map.put("moduleCount", track.getModules() != null ? track.getModules().size() : 0);

            int totalTopics = 0;
            if (track.getModules() != null) {
                for (PlacementModule m : track.getModules()) {
                    if (m.getTopics() != null) {
                        totalTopics += m.getTopics().size();
                    }
                }
            }
            map.put("topicCount", totalTopics);
            result.add(map);
        }
        return result;
    }

    @Transactional(readOnly = true)
    public Optional<PlacementTrack> getTrackBySlug(String slug) {
        Optional<PlacementTrack> trackOpt = trackRepository.findBySlugAndActiveTrue(slug);
        if (trackOpt.isPresent()) {
            PlacementTrack track = trackOpt.get();
            if (track.getModules() != null) {
                track.getModules().forEach(m -> {
                    if (m.getTopics() != null) {
                        m.getTopics().size(); // initialize collection within transaction
                    }
                });
            }
        }
        return trackOpt;
    }

    public List<PlacementQuestion> getPracticeQuestions(String category, String difficulty) {
        if (category != null && !category.equalsIgnoreCase("ALL") && difficulty != null && !difficulty.equalsIgnoreCase("ALL")) {
            return questionRepository.findByCategoryAndDifficultyOrderByDisplayOrderAsc(category.toUpperCase(), difficulty);
        } else if (category != null && !category.equalsIgnoreCase("ALL")) {
            return questionRepository.findByCategoryOrderByDisplayOrderAsc(category.toUpperCase());
        } else if (difficulty != null && !difficulty.equalsIgnoreCase("ALL")) {
            return questionRepository.findByDifficultyOrderByDisplayOrderAsc(difficulty);
        }
        return questionRepository.findAll();
    }

    public Map<String, Object> getUserPlacementProgress(String userEmail) {
        List<PlacementProgress> progressList = progressRepository.findByUserEmail(userEmail);
        Set<Long> completedTopicIds = progressList.stream()
                .filter(p -> "COMPLETED".equalsIgnoreCase(p.getStatus()))
                .map(PlacementProgress::getTopicId)
                .collect(Collectors.toSet());

        List<PlacementTrack> tracks = trackRepository.findByActiveTrueOrderByDisplayOrderAsc();
        Map<String, Object> trackProgress = new HashMap<>();
        long totalTopicsAllTracks = 0;
        long completedTopicsAllTracks = 0;

        for (PlacementTrack track : tracks) {
            int trackTotal = 0;
            int trackCompleted = 0;
            if (track.getModules() != null) {
                for (PlacementModule m : track.getModules()) {
                    if (m.getTopics() != null) {
                        for (PlacementTopic t : m.getTopics()) {
                            trackTotal++;
                            if (completedTopicIds.contains(t.getId())) {
                                trackCompleted++;
                            }
                        }
                    }
                }
            }
            totalTopicsAllTracks += trackTotal;
            completedTopicsAllTracks += trackCompleted;

            double pct = trackTotal > 0 ? ((double) trackCompleted / trackTotal) * 100.0 : 0.0;
            trackProgress.put(track.getSlug(), Map.of(
                    "completed", trackCompleted,
                    "total", trackTotal,
                    "percentage", Math.round(pct)
            ));
        }

        int readinessScore = 0;
        if (totalTopicsAllTracks > 0) {
            readinessScore = (int) Math.round(((double) completedTopicsAllTracks / totalTopicsAllTracks) * 100.0);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("userEmail", userEmail);
        response.put("completedTopicIds", completedTopicIds);
        response.put("totalCompleted", completedTopicsAllTracks);
        response.put("totalTopics", totalTopicsAllTracks);
        response.put("readinessScore", readinessScore);
        response.put("trackProgress", trackProgress);
        return response;
    }

    @Transactional
    public Map<String, Object> toggleTopicCompletion(String userEmail, String trackSlug, Long topicId) {
        Optional<PlacementProgress> existing = progressRepository.findByUserEmailAndTopicId(userEmail, topicId);
        PlacementProgress progress;
        boolean isCompleted;

        if (existing.isPresent()) {
            progress = existing.get();
            if ("COMPLETED".equalsIgnoreCase(progress.getStatus())) {
                progress.setStatus("NOT_STARTED");
                progress.setCompletedAt(null);
                isCompleted = false;
            } else {
                progress.setStatus("COMPLETED");
                progress.setCompletedAt(LocalDateTime.now());
                isCompleted = true;
            }
        } else {
            progress = new PlacementProgress(userEmail, trackSlug, topicId, "COMPLETED");
            isCompleted = true;
        }
        progressRepository.save(progress);

        return Map.of(
                "topicId", topicId,
                "status", progress.getStatus(),
                "completed", isCompleted
        );
    }
}
