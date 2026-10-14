package com.campusconnect.repository;

import com.campusconnect.entity.MockInterview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MockInterviewRepository extends JpaRepository<MockInterview, String> {
    List<MockInterview> findByUserEmailOrderByCreatedAtDesc(String userEmail);
    Optional<MockInterview> findByIdAndUserEmail(String id, String userEmail);
}
