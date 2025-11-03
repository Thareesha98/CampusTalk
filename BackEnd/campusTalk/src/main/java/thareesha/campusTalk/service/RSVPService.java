package thareesha.campusTalk.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import thareesha.campusTalk.model.Event;
import thareesha.campusTalk.model.RSVP;
import thareesha.campusTalk.model.User;
import thareesha.campusTalk.repository.EventRepository;
import thareesha.campusTalk.repository.RSVPRepository;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class RSVPService {

    @Autowired
    private RSVPRepository rsvpRepository;

    @Autowired
    private EventRepository eventRepository;

    // 🧩 Get all RSVPs in system (Admin only)
    public List<RSVP> getAllRSVPs() {
        return rsvpRepository.findAll();
    }

    // 🧩 Get RSVPs for a given event
    public List<RSVP> getRSVPsByEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return rsvpRepository.findByEvent(event);
    }

    // 🧩 Find RSVP by user and event
    public RSVP findByUserAndEvent(User user, Event event) {
        Optional<RSVP> optional = rsvpRepository.findByUserAndEvent(user, event);
        return optional.orElse(null);
    }

    // 🧩 Save or update RSVP
    public RSVP saveRSVP(RSVP rsvp) {
        return rsvpRepository.save(rsvp);
    }

    // 🧩 Delete RSVP
    public void deleteRSVP(Long id) {
        if (!rsvpRepository.existsById(id)) {
            throw new RuntimeException("RSVP not found");
        }
        rsvpRepository.deleteById(id);
    }
}
