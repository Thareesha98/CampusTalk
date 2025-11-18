package thareesha.campusTalk.controller;

import thareesha.campusTalk.dto.EventRequestDTO;
import thareesha.campusTalk.model.*;
import thareesha.campusTalk.security.JwtService;
import thareesha.campusTalk.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired private EventService eventService;
    @Autowired private ClubService clubService;
    @Autowired private UserService userService;
    @Autowired private JwtService jwtService;
    @Autowired private S3Service s3Service;
    @Autowired private NotificationService notificationService;
    @Autowired private FollowerService followerService;


    @GetMapping
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    @GetMapping("/{id}")
    public Event getEvent(@PathVariable Long id) {
        return eventService.getEventById(id);
    }

    // 🆕 CREATE EVENT
    @PreAuthorize("hasAnyRole('CHAIRMAN','ADMIN')")
    @PostMapping(value = "/club/{clubId}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> createEvent(
            @PathVariable Long clubId,
            @RequestPart("dto") EventRequestDTO dto,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestHeader("Authorization") String tokenHeader) {

        try {
            // 🔑 Extract user
            String token = tokenHeader.substring(7);
            String email = jwtService.extractEmail(token);
            User creator = userService.findByEmail(email).orElseThrow();

            Club club = clubService.getClubById(clubId);
            if (creator.getRole().equals("CHAIRMAN") &&
                    (club.getChairman() == null || !club.getChairman().getId().equals(creator.getId()))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You can only create events for your own club"));
            }

            // 🖼 Upload image
            String imageUrl = null;
            if (file != null && !file.isEmpty()) {
                imageUrl = s3Service.uploadFile(file, "event-images/");
            }

            // 🧩 Create event
            Event event = new Event();
            event.setTitle(dto.getTitle());
            event.setDescription(dto.getDescription());
            event.setLocation(dto.getLocation());
            event.setCreatedBy(creator);
            event.setClub(club);
            event.setImageUrl(imageUrl);

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

            // 🔔 Notify ALL followers (DB + WebSocket)
            List<User> followers = followerService.getFollowers(club);
            followers.forEach(f ->
                notificationService.notify(
                        f,
                        "New Event Posted",
                        club.getName() + " posted a new event: " + saved.getTitle(),
                        "EVENT",
                        saved.getId()
                )
            );

            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create event: " + e.getMessage()));
        }
    }


    // ✏️ UPDATE EVENT
    @PreAuthorize("hasAnyRole('CHAIRMAN','ADMIN')")
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateEvent(
            @PathVariable Long id,
            @RequestPart("dto") EventRequestDTO dto,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestHeader("Authorization") String tokenHeader) {

        try {
            String token = tokenHeader.substring(7);
            String email = jwtService.extractEmail(token);
            User updater = userService.findByEmail(email).orElseThrow();

            Event existing = eventService.getEventById(id);

            if (updater.getRole().equals("CHAIRMAN") &&
                    (existing.getClub().getChairman() == null ||
                            !existing.getClub().getChairman().getId().equals(updater.getId()))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You can only edit events of your club"));
            }

            if (file != null && !file.isEmpty()) {
                String newImageUrl = s3Service.uploadFile(file, "event-images/");
                existing.setImageUrl(newImageUrl);
            }

            existing.setTitle(dto.getTitle());
            existing.setDescription(dto.getDescription());
            existing.setLocation(dto.getLocation());

            try {
                if (dto.getDateTime() != null && !dto.getDateTime().isBlank()) {
                    existing.setDateTime(LocalDateTime.parse(dto.getDateTime()));
                }
            } catch (DateTimeParseException ignored) {}

            return ResponseEntity.ok(eventService.updateEvent(id, existing));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update event: " + e.getMessage()));
        }
    }


    // 🗑 DELETE EVENT
    @PreAuthorize("hasAnyRole('CHAIRMAN','ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {

        Event event = eventService.getEventById(id);
        List<User> followers = followerService.getFollowers(event.getClub());

        // 🔔 Notify followers
        followers.forEach(f ->
                notificationService.notify(
                        f,
                        "Event Deleted",
                        "The event \"" + event.getTitle() + "\" was removed.",
                        "EVENT",
                        event.getId()
                )
        );

        eventService.deleteEvent(id);

        return ResponseEntity.ok(Map.of("message", "Event deleted"));
    }


    // 📋 GET EVENTS BY CLUB
    @GetMapping("/club/{clubId}")
    public List<Event> getEventsByClub(@PathVariable Long clubId) {
        return eventService.getEventsByClubId(clubId);
    }
}
