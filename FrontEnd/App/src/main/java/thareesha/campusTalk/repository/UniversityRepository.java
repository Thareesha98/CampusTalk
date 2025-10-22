package thareesha.campusTalk.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import thareesha.campusTalk.model.University;

import java.util.Optional;

public interface UniversityRepository extends JpaRepository<University, Long> {
    Optional<University> findByName(String name);
    
}
