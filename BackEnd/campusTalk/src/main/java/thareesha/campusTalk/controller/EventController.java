package thareesha.campusTalk.controller;

import thareesha.campusTalk.model.*;
import thareesha.campusTalk.security.JwtService;
import thareesha.campusTalk.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@CrossOrigin
public class EventController {

    @Autowired private EventService eventService;
    @Autowired private ClubService clubService;
    @Autowired private UserService userService;
    @Autowired private JwtService jwtService;

    @GetMapping
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    @GetMapping("/{id}")
    public Event getEvent(@PathVariable Long id) {
        return eventService.getEventById(id);
    }

    // 🔒 Only chairman/admin can create events
    @PreAuthorize("hasAnyRole('CHAIRMAN','ADMIN')")
    @PostMapping("/club/{clubId}")
    public ResponseEntity<?> createEvent(
            @PathVariable Long clubId,
            @RequestBody Event event,
            @RequestHeader("Authorization") String tokenHeader) {

        String token = tokenHeader.substring(7);
        String email = jwtService.extractEmail(token);
        User creator = userService.findByEmail(email).orElseThrow();

        Club club = clubService.getClubById(clubId);

        if (creator.getRole().equals("CHAIRMAN") && !club.getChairman().getId().equals(creator.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You can only create events for your own club"));
        }

        event.setClub(club);
        event.setCreatedBy(creator);
        event.setDateTime(LocalDateTime.now());
        eventService.createEvent(event);
        return ResponseEntity.ok(event);
    }

    @PreAuthorize("hasAnyRole('CHAIRMAN','ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(
            @PathVariable Long id,
            @RequestBody Event event) {
        Event updated = eventService.updateEvent(id, event);
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasAnyRole('CHAIRMAN','ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(Map.of("message", "Event deleted"));
    }

    @GetMapping("/club/{clubId}")
    public List<Event> getEventsByClub(@PathVariable Long clubId) {
        return eventService.getEventsByClubId(clubId);
    }
}
