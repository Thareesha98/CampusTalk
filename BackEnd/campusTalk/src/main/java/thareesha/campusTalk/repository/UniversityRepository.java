package thareesha.campusTalk.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import thareesha.campusTalk.model.University;

import java.util.Optional;

public interface UniversityRepository extends JpaRepository<University, Long> {
    Optional<University> findByName(String name);
    
    @Query("""
    	    SELECT u FROM University u
    	    LEFT JOIN FETCH u.clubs c
    	    WHERE u.id = :id
    	""")
    	Optional<University> fetchWithClubs(@Param("id") Long id);


}
