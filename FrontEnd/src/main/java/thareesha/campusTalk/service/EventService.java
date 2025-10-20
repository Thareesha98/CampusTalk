package thareesha.campusTalk.service;


import thareesha.campusTalk.model.Event;
import thareesha.campusTalk.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
    }

    public Event createEvent(Event event) {
        // ensure createdAt/dateTime set by caller or set defaults here if needed
        return eventRepository.save(event);
    }

    public Event updateEvent(Long id, Event updatedEvent) {
        return eventRepository.findById(id).map(event -> {
            // update only fields you want to allow updates for
            event.setTitle(updatedEvent.getTitle());
            event.setDescription(updatedEvent.getDescription());
            event.setLocation(updatedEvent.getLocation());
            event.setDateTime(updatedEvent.getDateTime()); // correct getter/setter name
            // update club relation if provided
            if (updatedEvent.getClub() != null) {
                event.setClub(updatedEvent.getClub());
            }
            // optionally update createdBy if needed:
            if (updatedEvent.getCreatedBy() != null) {
                event.setCreatedBy(updatedEvent.getCreatedBy());
            }
            return eventRepository.save(event);
        }).orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
    }

    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new RuntimeException("Event not found with id: " + id);
        }
        eventRepository.deleteById(id);
    }

    public List<Event> getEventsByClubId(Long clubId) {
        return eventRepository.findByClubId(clubId);
    }
}

