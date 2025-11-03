package thareesha.campusTalk.controller;

import thareesha.campusTalk.dto.RSVPRequestDTO;
import thareesha.campusTalk.model.*;
import thareesha.campusTalk.security.JwtService;
import thareesha.campusTalk.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/rsvps")
@CrossOrigin
public class RSVPController {

    @Autowired private RSVPService rsvpService;
    @Autowired private EventService eventService;
    @Autowired private UserService userService;
    @Autowired private JwtService jwtService;

    // 🧩 Get all RSVPs for an event
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<RSVP>> getRSVPsByEvent(@PathVariable Long eventId) {
        List<RSVP> rsvps = rsvpService.getRSVPsByEvent(eventId);
        return ResponseEntity.ok(rsvps);
    }

    // 🧍 User RSVPs for an event
    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<?> createRSVP(
            @RequestBody RSVPRequestDTO dto,
            @RequestHeader("Authorization") String tokenHeader) {

        try {
            String token = tokenHeader.substring(7);
            String email = jwtService.extractEmail(token);
            User user = userService.findByEmail(email).orElseThrow();

            Event event = eventService.getEventById(dto.getEventId());
            if (event == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Event not found"));
            }

            RSVP existing = rsvpService.findByUserAndEvent(user, event);
            if (existing != null) {
                existing.setStatus(dto.getStatus());
                RSVP updated = rsvpService.saveRSVP(existing);
                return ResponseEntity.ok(updated);
            }

            RSVP rsvp = new RSVP();
            rsvp.setEvent(event);
            rsvp.setUser(user);
            rsvp.setStatus(dto.getStatus());
            rsvp.setTimestamp(LocalDateTime.now());

            RSVP saved = rsvpService.saveRSVP(rsvp);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to save RSVP: " + e.getMessage()));
        }
    }

    // 🗑 Delete RSVP
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRSVP(@PathVariable Long id) {
        rsvpService.deleteRSVP(id);
        return ResponseEntity.ok(Map.of("message", "RSVP deleted successfully"));
    }

    // 📋 All RSVPs in system (Admin only)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<RSVP> getAllRSVPs() {
        return rsvpService.getAllRSVPs();
    }
}
