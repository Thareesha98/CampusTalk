package thareesha.campusTalk.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import thareesha.campusTalk.model.Club;

public interface ClubRepository extends JpaRepository<Club , Long> {
	List<Club> findByChairmanId(Long chairmanId);
}
 