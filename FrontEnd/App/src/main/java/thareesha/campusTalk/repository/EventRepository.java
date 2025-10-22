package thareesha.campusTalk.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import thareesha.campusTalk.model.Event;

public interface EventRepository extends JpaRepository<Event , Long>{
	List<Event> findByClubId(Long clubId);
}
