package thareesha.campusTalk.controller;

import thareesha.campusTalk.dto.EventRequestDTO;
import thareesha.campusTalk.model.*;
import thareesha.campusTalk.security.JwtService;
import thareesha.campusTalk.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
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

    // 🆕 CREATE EVENT (CHAIRMAN or ADMIN)
    @PreAuthorize("hasAnyRole('CHAIRMAN','ADMIN')")
    @PostMapping("/club/{clubId}")
    public ResponseEntity<?> createEvent(
            @PathVariable Long clubId,
            @RequestBody EventRequestDTO dto,
            @RequestHeader("Authorization") String tokenHeader) {

        try {
            // 🔑 Get user info
            String token = tokenHeader.substring(7);
            String email = jwtService.extractEmail(token);
            User creator = userService.findByEmail(email).orElseThrow();

            Club club = clubService.getClubById(clubId);
            if (creator.getRole().equals("CHAIRMAN") &&
                    (club.getChairman() == null || !club.getChairman().getId().equals(creator.getId()))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You can only create events for your own club"));
            }

            // 🧩 Build Event from DTO
            Event event = new Event();
            event.setTitle(dto.getTitle());
            event.setDescription(dto.getDescription());
            event.setLocation(dto.getLocation());
            event.setCreatedBy(creator);
            event.setClub(club);

            // Safely parse dateTime
            try {
                if (dto.getDateTime() != null && !dto.getDateTime().isBlank()) {
                    event.setDateTime(LocalDateTime.parse(dto.getDateTime()));
                } else {
                    event.setDateTime(LocalDateTime.now());
                }
            } catch (DateTimeParseException e) {
                event.setDateTime(LocalDateTime.now());
            }

            Event saved = eventService.createEvent(event);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create event: " + e.getMessage()));
        }
    }

    // ✏️ UPDATE EVENT
    @PreAuthorize("hasAnyRole('CHAIRMAN','ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(
            @PathVariable Long id,
            @RequestBody EventRequestDTO dto,
            @RequestHeader("Authorization") String tokenHeader) {
        try {
            Event existing = eventService.getEventById(id);
            if (existing == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Event not found"));
            }

            existing.setTitle(dto.getTitle());
            existing.setDescription(dto.getDescription());
            existing.setLocation(dto.getLocation());

            try {
                if (dto.getDateTime() != null && !dto.getDateTime().isBlank()) {
                    existing.setDateTime(LocalDateTime.parse(dto.getDateTime()));
                }
            } catch (DateTimeParseException ignored) {}

            Event updated = eventService.updateEvent(id, existing);
            return ResponseEntity.ok(updated);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update event: " + e.getMessage()));
        }
    }

    // 🗑 DELETE EVENT
    @PreAuthorize("hasAnyRole('CHAIRMAN','ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(Map.of("message", "Event deleted"));
    }

    // 📋 GET EVENTS BY CLUB
    @GetMapping("/club/{clubId}")
    public List<Event> getEventsByClub(@PathVariable Long clubId) {
        return eventService.getEventsByClubId(clubId);
    }
}
