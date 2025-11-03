package thareesha.campusTalk.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import thareesha.campusTalk.model.RSVP;
import thareesha.campusTalk.model.User;
import thareesha.campusTalk.model.Event;

public interface RSVPRepository extends JpaRepository<RSVP , Long>{
	List<RSVP> findByEventId(Long eventId);
	List<RSVP> findByUserId(Long userId);
	Optional<RSVP> findByUserIdAndEventId(Long userId , Long eventId);
	List<RSVP> findByEvent(Event event);

    // Check if a user has already RSVP’d for a specific event
    Optional<RSVP> findByUserAndEvent(User user, Event event);
}
