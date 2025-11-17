package thareesha.campusTalk.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import thareesha.campusTalk.model.University;

import java.util.List;
import java.util.Optional;

public interface UniversityRepository extends JpaRepository<University, Long> {
    Optional<University> findByName(String name);

    // Fetch university with clubs and followers in a single query.
    // DISTINCT on u prevents duplicate University rows; followers are fetched for each club.
    @Query("""
        SELECT DISTINCT u FROM University u
        LEFT JOIN FETCH u.clubs c
        LEFT JOIN FETCH c.followers f
        WHERE u.id = :id
    """)
    Optional<University> fetchWithClubsAndFollowers(@Param("id") Long id);
    @Query("""
    	    SELECT DISTINCT u FROM University u
    	    LEFT JOIN FETCH u.clubs c
    	    LEFT JOIN FETCH u.students s
    	""")
    	List<University> fetchAllWithClubsAndStudents();

}
