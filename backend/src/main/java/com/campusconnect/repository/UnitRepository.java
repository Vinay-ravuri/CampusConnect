package com.campusconnect.repository;

import com.campusconnect.entity.Unit;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UnitRepository extends JpaRepository<Unit, Long> {
    List<Unit> findBySubjectIdOrderByUnitNumAsc(Long subjectId);
}
