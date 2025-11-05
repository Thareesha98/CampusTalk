package thareesha.campusTalk.controller;

import thareesha.campusTalk.dto.ClubCreateDTO;
import thareesha.campusTalk.model.*;
import thareesha.campusTalk.repository.ClubRepository;
import thareesha.campusTalk.security.JwtService;
import thareesha.campusTalk.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/clubs")
@CrossOrigin(origins = "*")
public class ClubController {

    @Autowired private ClubService clubService;
    @Autowired private ClubMemberService clubMemberService;
    @Autowired private UserService userService;
    @Autowired private JwtService jwtService;
    @Autowired private S3Service s3Service;
    @Autowired private ClubRepository clubRepository;

    // ────────────────────────────────────────────────
    // 📜 Get All Clubs
    // ────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<List<Club>> getAllClubs() {
        return ResponseEntity.ok(clubService.getAllClubs());
    }

    // ────────────────────────────────────────────────
    // 📜 Get Specific Club
    // ────────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<?> getClub(@PathVariable Long id) {
        try {
            Club club = clubService.getClubById(id);
            return ResponseEntity.ok(club);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

   
    
    
    
    
    
    
    
    
    // ────────────────────────────────────────────────
    // ✏️ Update Club (Chairman or Admin)
    // ────────────────────────────────────────────────
    
    
    
    
    
    
    
    
    
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateClub(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        try {
            Club club = clubRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Club not found"));

            club.setName(name);
            club.setDescription(description);

            if (file != null && !file.isEmpty()) {
                String logoUrl = s3Service.uploadFile(file, "club-logos/");
                club.setProfilePicUrl(logoUrl);
            }

            Club updated = clubRepository.save(club);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update club: " + e.getMessage()));
        }
    }

    
    
    
    
    
    
    

    // ────────────────────────────────────────────────
    // 🗑 Delete Club (Admin only)
    // ────────────────────────────────────────────────
    
    @PreAuthorize("hasAnyRole('ADMIN', 'CHAIRMAN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClub(@PathVariable Long id) {
        if (!clubRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Club not found"));
        }
        clubRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Club deleted successfully"));
    }

    // ────────────────────────────────────────────────
    // 🏫 Get Clubs by University
    // ────────────────────────────────────────────────
    @GetMapping("/university/{universityId}")
    public ResponseEntity<List<Club>> getClubsByUniversity(@PathVariable Long universityId) {
        return ResponseEntity.ok(clubService.getClubsByUniversity(universityId));
    }

    // ────────────────────────────────────────────────
    // ❤️ Follow / Unfollow Club (Student/Chairman)
    // ────────────────────────────────────────────────
    @PreAuthorize("hasAnyRole('STUDENT', 'CHAIRMAN')")
    @PostMapping("/{clubId}/follow")
    public ResponseEntity<?> followClub(
            @PathVariable Long clubId,
            @RequestHeader("Authorization") String tokenHeader) {

        String token = tokenHeader.substring(7);
        String email = jwtService.extractEmail(token);
        User follower = userService.findByEmail(email).orElseThrow();

        Club club = clubService.getClubById(clubId);
        ensureFollowersLoaded(club); // ✅ force collection initialization

        // prevent duplicate follows
        if (!club.getFollowers().contains(follower)) {
            club.getFollowers().add(follower);
            clubRepository.save(club);
        }

        return ResponseEntity.ok(Map.of(
                "message", "You are now following " + club.getName(),
                "followersCount", club.getFollowers().size()
        ));
    }
    
    private void ensureFollowersLoaded(Club club) {
        // Force initialization of lazy collection before modifying
        club.getFollowers().size();
    }

    

    @PreAuthorize("hasAnyRole('STUDENT', 'CHAIRMAN')")
    @PostMapping("/{clubId}/unfollow")
    public ResponseEntity<?> unfollowClub(
            @PathVariable Long clubId,
            @RequestHeader("Authorization") String tokenHeader) {

        String token = tokenHeader.substring(7);
        String email = jwtService.extractEmail(token);
        User follower = userService.findByEmail(email).orElseThrow();

        Club club = clubService.getClubById(clubId);
        club.getFollowers().remove(follower);
        clubRepository.save(club);

        return ResponseEntity.ok(Map.of("message", "You unfollowed " + club.getName()));
    }

    // ────────────────────────────────────────────────
    // 🧑‍🤝‍🧑 Club Members
    // ────────────────────────────────────────────────
    @GetMapping("/{clubId}/members")
    public ResponseEntity<List<User>> getClubMembers(@PathVariable Long clubId) {
        List<User> users = clubMemberService.getMembersByClub(clubId)
                .stream().map(ClubMember::getUser).toList();
        return ResponseEntity.ok(users);
    }

    // ────────────────────────────────────────────────
    // 🖼 Upload Club Profile Picture (Chairman/Admin)
    // ────────────────────────────────────────────────
    @PreAuthorize("hasAnyRole('ADMIN','CHAIRMAN')")
    @PostMapping("/{clubId}/upload-profile-pic")
    public ResponseEntity<?> uploadClubProfilePic(
            @PathVariable Long clubId,
            @RequestParam("file") MultipartFile file,
            @RequestHeader("Authorization") String tokenHeader) {

        try {
            String token = tokenHeader.substring(7);
            String email = jwtService.extractEmail(token);
            User user = userService.findByEmail(email).orElseThrow();

            Club club = clubService.getClubById(clubId);

            if ("CHAIRMAN".equals(user.getRole()) &&
                !club.getChairman().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only this club’s chairman can update the picture"));
            }

            String imageUrl = s3Service.uploadFile(file, "club-profile-pics/");
            club.setProfilePicUrl(imageUrl);
            clubRepository.save(club);

            return ResponseEntity.ok(Map.of("message", "Club profile picture updated", "url", imageUrl));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('CHAIRMAN','ADMIN')")
    public ResponseEntity<?> createClub(
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestHeader("Authorization") String tokenHeader
    ) {
        try {
            String token = tokenHeader.substring(7);
            String email = jwtService.extractEmail(token);
            User creator = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String logoUrl = null;

            // 🖼 Upload logo to S3 if provided
            if (file != null && !file.isEmpty()) {
                logoUrl = s3Service.uploadFile(file, "club-logos/");
            }

            Club club = new Club();
            club.setName(name);
            club.setDescription(description);
            club.setProfilePicUrl(logoUrl);
            club.setUniversity(creator.getUniversity());

            // ✅ Automatically set chairman if user is chairman
            if ("CHAIRMAN".equals(creator.getRole())) {
                club.setChairman(creator);
            }

            Club saved = clubRepository.save(club);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create club: " + e.getMessage()));
        }
    }

 // ────────────────────────────────────────────────
 // ❤️ JOIN / LEAVE CLUB (Toggle for Students)
 // ────────────────────────────────────────────────
 @PreAuthorize("hasAnyRole('STUDENT', 'CHAIRMAN')")
 @PostMapping("/{clubId}/join")
 public ResponseEntity<?> joinOrLeaveClub(
         @PathVariable Long clubId,
         @RequestHeader("Authorization") String tokenHeader) {
     try {
         String token = tokenHeader.substring(7);
         String email = jwtService.extractEmail(token);
         User user = userService.findByEmail(email)
                 .orElseThrow(() -> new RuntimeException("User not found"));

         boolean joined = clubService.toggleJoinClub(clubId, user.getId());

         String message = joined ? "Joined club successfully" : "Left the club";
         return ResponseEntity.ok(Map.of(
                 "message", message,
                 "joined", joined
         ));
     } catch (Exception e) {
         e.printStackTrace();
         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                 .body(Map.of("error", "Failed to join/leave club: " + e.getMessage()));
     }
 }

 // ────────────────────────────────────────────────
 // 📜 Get All Clubs Joined by the Current User
 // ────────────────────────────────────────────────
 
 
 @PreAuthorize("isAuthenticated()")
 @GetMapping("/joined")
 public ResponseEntity<?> getUserJoinedClubs(@RequestHeader("Authorization") String tokenHeader) {
     try {
         String token = tokenHeader.substring(7);
         String email = jwtService.extractEmail(token);
         User user = userService.findByEmail(email)
                 .orElseThrow(() -> new RuntimeException("User not found"));

         List<Club> joinedClubs = clubService.getJoinedClubs(user.getId());

         List<Map<String, Object>> result = joinedClubs.stream().map(c -> {
             Map<String, Object> map = new HashMap<>();
             map.put("id", c.getId());
             map.put("name", c.getName());
             map.put("description", c.getDescription());
             map.put("profilePicUrl", c.getProfilePicUrl());
             map.put("university", c.getUniversity() != null ? c.getUniversity().getName() : null);
             return map;
         }).toList();

         return ResponseEntity.ok(result);
     } catch (Exception e) {
         e.printStackTrace();
         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                 .body(Map.of("error", "Failed to fetch joined clubs: " + e.getMessage()));
     }
 }

 
 
 


}









