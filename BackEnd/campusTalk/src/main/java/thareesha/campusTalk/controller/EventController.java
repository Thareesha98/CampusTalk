package thareesha.campusTalk.controller;

import thareesha.campusTalk.dto.EventRequestDTO;
import thareesha.campusTalk.dto.NotificationDTO;
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
    
    @Autowired
    private S3Service s3Service;
    
    @Autowired 
    private NotificationService notificationService;

    @Autowired 
    private FollowerService followerService;  // followers of clubs


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
    @PostMapping(value = "/club/{clubId}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> createEvent(
            @PathVariable Long clubId,
            @RequestPart("dto") EventRequestDTO dto,
            @RequestPart(value = "file", required = false) MultipartFile file,
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

            // 🖼 Upload image if present
            String imageUrl = null;
            if (file != null && !file.isEmpty()) {
                System.out.println("✅ Uploading file to S3: " + file.getOriginalFilename());
                imageUrl = s3Service.uploadFile(file, "event-images/");
            } else {
                System.out.println("⚠️ No image file uploaded");
            }

            // 🧩 Build Event from DTO
            Event event = new Event();
            event.setTitle(dto.getTitle());
            event.setDescription(dto.getDescription());
            event.setLocation(dto.getLocation());
            event.setCreatedBy(creator);
            event.setClub(club);
            event.setImageUrl(imageUrl); // ✅ set uploaded image URL

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
            
         // 🔔 Notify followers in real-time
            List<User> followers = followerService.getFollowers(club);

            followers.forEach(f ->
                notificationService.sendToUser(
                    f.getId(),
                    new NotificationDTO(
                        "New Event Posted",
                        club.getName() + " posted: " + saved.getTitle(),
                        f.getId()
                    )
                )
            );

            
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            e.printStackTrace();
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
            // 🔑 Get user info (if you want to enforce chairman access check)
            String token = tokenHeader.substring(7);
            String email = jwtService.extractEmail(token);
            User updater = userService.findByEmail(email).orElseThrow();

            Event existing = eventService.getEventById(id);
            if (existing == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Event not found"));
            }

            // 🧠 Optional: Verify only chairman of that club can edit
            if (updater.getRole().equals("CHAIRMAN") &&
                    (existing.getClub().getChairman() == null ||
                            !existing.getClub().getChairman().getId().equals(updater.getId()))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You can only edit events of your own club"));
            }

            // 🖼 Upload new image (if provided)
            if (file != null && !file.isEmpty()) {
                System.out.println("✅ Uploading new event image: " + file.getOriginalFilename());
                String newImageUrl = s3Service.uploadFile(file, "event-images/");
                existing.setImageUrl(newImageUrl);
            }

            // 🧩 Update details from DTO
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

        // 🟦 Get event first (same logic used in update)
        Event event = eventService.getEventById(id);

        // 🟦 Get followers of the club (non-breaking helper)
        List<User> followers = followerService.getFollowers(event.getClub());

        // 🟦 Send real-time notifications
        followers.forEach(f ->
                notificationService.sendToUser(
                        f.getId(),
                        new NotificationDTO(
                                "Event Deleted",
                                "The event \"" + event.getTitle() + "\" has been removed.",
                                f.getId()
                        )
                )
        );

        // 🟥 Now delete the event (your original logic)
        eventService.deleteEvent(id);

        // 🟦 Return your original response
        return ResponseEntity.ok(Map.of("message", "Event deleted"));
    }

    // 📋 GET EVENTS BY CLUB
    @GetMapping("/club/{clubId}")
    public List<Event> getEventsByClub(@PathVariable Long clubId) {
        return eventService.getEventsByClubId(clubId);
    }
}
