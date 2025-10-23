package thareesha.campusTalk.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import thareesha.campusTalk.model.RSVP;

public interface RSVPRepository extends JpaRepository<RSVP , Long>{
	List<RSVP> findByEventId(Long eventId);
	List<RSVP> findByUserId(Long userId);
	Optional<RSVP> findByUserIdAndEventId(Long userId , Long eventId);
}
