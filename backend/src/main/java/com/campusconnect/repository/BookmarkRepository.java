package com.campusconnect.repository;

import com.campusconnect.entity.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    List<Bookmark> findByUserEmail(String userEmail);
    Optional<Bookmark> findByUserEmailAndTargetTypeAndTargetId(String userEmail, String targetType, String targetId);
}
