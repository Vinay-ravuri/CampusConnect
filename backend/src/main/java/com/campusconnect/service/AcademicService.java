package com.campusconnect.service;

import com.campusconnect.entity.Regulation;
import com.campusconnect.entity.Resource;
import com.campusconnect.entity.Subject;
import com.campusconnect.entity.Unit;
import com.campusconnect.repository.RegulationRepository;
import com.campusconnect.repository.ResourceRepository;
import com.campusconnect.repository.SubjectRepository;
import com.campusconnect.repository.UnitRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AcademicService {

    private final RegulationRepository regulationRepository;
    private final SubjectRepository subjectRepository;
    private final UnitRepository unitRepository;
    private final ResourceRepository resourceRepository;

    public AcademicService(RegulationRepository regulationRepository, SubjectRepository subjectRepository,
                           UnitRepository unitRepository, ResourceRepository resourceRepository) {
        this.regulationRepository = regulationRepository;
        this.subjectRepository = subjectRepository;
        this.unitRepository = unitRepository;
        this.resourceRepository = resourceRepository;
    }

    public List<Regulation> getRegulations() {
        return regulationRepository.findByActiveTrue();
    }

    public List<Subject> getSubjectsByRegulation(String regCode) {
        return subjectRepository.findByRegulationCodeAndActiveTrue(regCode);
    }

    public java.util.Optional<Subject> getSubjectById(Long id) {
        return subjectRepository.findById(id);
    }

    public List<Subject> searchSubjects(String query) {
        return subjectRepository.findByNameContainingIgnoreCaseAndActiveTrue(query);
    }

    public List<Unit> getUnitsBySubject(Long subjectId) {
        return unitRepository.findBySubjectIdOrderByUnitNumAsc(subjectId);
    }

    public List<Resource> getResourcesByUnit(Long unitId) {
        return resourceRepository.findByUnitIdAndActiveTrue(unitId);
    }

    // Admin operations
    public Subject addSubject(Subject subject) {
        Subject saved = subjectRepository.save(subject);

        // Auto-generate 5 units for new subject if none exist
        for (int i = 1; i <= 5; i++) {
            Unit unit = new Unit(
                i,
                "Unit " + i + ": " + subject.getName() + " Core Topics",
                "Syllabus coverage, study guides, and critical Q&A for Unit " + i,
                saved.getId()
            );
            unitRepository.save(unit);
        }

        return saved;
    }

    public void deleteSubject(Long id) {
        Subject s = subjectRepository.findById(id).orElseThrow(() -> new RuntimeException("Subject not found"));
        s.setActive(false);
        subjectRepository.save(s);
    }

    public Resource addResource(Resource resource) {
        return resourceRepository.save(resource);
    }
}
