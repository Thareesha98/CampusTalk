package thareesha.campusTalk.service;

import thareesha.campusTalk.model.Event;
import thareesha.campusTalk.model.RSVP;
import thareesha.campusTalk.model.User;
import thareesha.campusTalk.repository.RSVPRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RSVPService {

    @Autowired
    private RSVPRepository rsvpRepository;

    // 🔹 Save or update RSVP
    public RSVP saveRSVP(RSVP rsvp) {
        return rsvpRepository.save(rsvp);
    }

    // 🔹 Get all RSVPs in the system (Admin)
    public List<RSVP> getAllRSVPs() {
        return rsvpRepository.findAll();
    }

    // 🔹 Get RSVPs by event ID
    public List<RSVP> getRSVPsByEvent(Long eventId) {
        return rsvpRepository.findByEventId(eventId);
    }

    // 🔹 Get RSVP by user and event
    public RSVP findByUserAndEvent(User user, Event event) {
        return rsvpRepository.findByUserAndEvent(user, event).orElse(null);
    }

    // 🔹 Get all RSVPs made by a specific user
    public List<RSVP> getByUser(User user) {
        return rsvpRepository.findByUserId(user.getId());
    }

    // 🔹 Delete RSVP by ID
    public void deleteRSVP(Long id) {
        if (!rsvpRepository.existsById(id)) {
            throw new RuntimeException("RSVP not found with id: " + id);
        }
        rsvpRepository.deleteById(id);
    }

    // 🔹 Optional: Get RSVPs by event entity
    public List<RSVP> getByEvent(Event event) {
        return rsvpRepository.findByEvent(event);
    }

    // 🔹 Optional: Remove RSVP by user and event
    public void removeRSVP(User user, Event event) {
        Optional<RSVP> existing = rsvpRepository.findByUserAndEvent(user, event);
        existing.ifPresent(rsvpRepository::delete);
    }

    // ✅ NEW: Get RSVPs for the currently logged-in user
    public List<RSVP> getRSVPsByUser(User user) {
        return rsvpRepository.findByUserId(user.getId());
    }
}
