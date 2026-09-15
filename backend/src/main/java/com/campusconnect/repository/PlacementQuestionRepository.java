package com.campusconnect.repository;

import com.campusconnect.entity.PlacementQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlacementQuestionRepository extends JpaRepository<PlacementQuestion, Long> {
    List<PlacementQuestion> findByCategoryOrderByDisplayOrderAsc(String category);
    List<PlacementQuestion> findByDifficultyOrderByDisplayOrderAsc(String difficulty);
    List<PlacementQuestion> findByCategoryAndDifficultyOrderByDisplayOrderAsc(String category, String difficulty);
}
