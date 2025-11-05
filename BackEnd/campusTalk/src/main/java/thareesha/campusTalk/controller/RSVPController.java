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

    // 🧩 Get all RSVPs for a specific event
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<RSVP>> getRSVPsByEvent(@PathVariable Long eventId) {
        List<RSVP> rsvps = rsvpService.getRSVPsByEvent(eventId);
        return ResponseEntity.ok(rsvps);
    }

    // 🧍 Create or update RSVP directly with DTO (alternative entry point)
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
            if (event == null)
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Event not found"));

            RSVP existing = rsvpService.findByUserAndEvent(user, event);
            if (existing != null) {
                existing.setStatus(dto.getStatus());
                existing.setTimestamp(LocalDateTime.now());
                return ResponseEntity.ok(rsvpService.saveRSVP(existing));
            }

            RSVP newRSVP = new RSVP();
            newRSVP.setUser(user);
            newRSVP.setEvent(event);
            newRSVP.setStatus(dto.getStatus());
            newRSVP.setTimestamp(LocalDateTime.now());
            return ResponseEntity.ok(rsvpService.saveRSVP(newRSVP));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to save RSVP: " + e.getMessage()));
        }
    }

    // 🧠 Main endpoint used by frontend (Interested / Going buttons)
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{eventId}/respond")
    public ResponseEntity<?> respondToEvent(
            @PathVariable Long eventId,
            @RequestBody Map<String, String> body,
            @RequestHeader("Authorization") String tokenHeader) {

        try {
            String token = tokenHeader.substring(7);
            String email = jwtService.extractEmail(token);
            User user = userService.findByEmail(email).orElseThrow();

            Event event = eventService.getEventById(eventId);
            if (event == null)
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Event not found"));

            String status = body.get("status");
            if (status == null || status.isBlank())
                return ResponseEntity.badRequest().body(Map.of("error", "Status is required"));

            RSVP existing = rsvpService.findByUserAndEvent(user, event);
            if (existing != null) {
                existing.setStatus(status);
                existing.setTimestamp(LocalDateTime.now());
                return ResponseEntity.ok(rsvpService.saveRSVP(existing));
            }

            RSVP rsvp = new RSVP();
            rsvp.setEvent(event);
            rsvp.setUser(user);
            rsvp.setStatus(status);
            rsvp.setTimestamp(LocalDateTime.now());
            return ResponseEntity.ok(rsvpService.saveRSVP(rsvp));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to save RSVP: " + e.getMessage()));
        }
    }

    // 🧍 Get all RSVPs of the current user
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/my")
    public ResponseEntity<?> getMyRSVPs(@RequestHeader("Authorization") String tokenHeader) {
        try {
            String token = tokenHeader.substring(7);
            String email = jwtService.extractEmail(token);
            User user = userService.findByEmail(email).orElseThrow();

            // ⚡ Return lightweight RSVP data (eventId + status)
            List<Map<String, Object>> list = new ArrayList<>();
            for (RSVP r : rsvpService.getRSVPsByUser(user)) {
                Map<String, Object> map = new HashMap<>();
                map.put("eventId", r.getEvent().getId());
                map.put("status", r.getStatus());
                list.add(map);
            }

            return ResponseEntity.ok(list);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }


    // 🗑 Delete RSVP
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRSVP(@PathVariable Long id) {
        rsvpService.deleteRSVP(id);
        return ResponseEntity.ok(Map.of("message", "RSVP deleted successfully"));
    }

    // 🧾 Admin: Get all RSVPs in system
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<RSVP> getAllRSVPs() {
        return rsvpService.getAllRSVPs();
    }
}
