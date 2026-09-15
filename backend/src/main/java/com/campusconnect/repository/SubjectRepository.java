package com.campusconnect.repository;

import com.campusconnect.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findByRegulationCodeAndActiveTrue(String regulationCode);
    List<Subject> findByNameContainingIgnoreCaseAndActiveTrue(String name);
}
