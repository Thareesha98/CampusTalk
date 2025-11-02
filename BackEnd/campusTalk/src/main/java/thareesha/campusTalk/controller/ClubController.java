package thareesha.campusTalk.controller;

import thareesha.campusTalk.model.*;
import thareesha.campusTalk.repository.ClubRepository;
import thareesha.campusTalk.security.JwtService;
import thareesha.campusTalk.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/api/clubs")
@CrossOrigin
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
    public List<Club> getAllClubs() {
        return clubService.getAllClubs();
    }

    // ────────────────────────────────────────────────
    // 📜 Get Specific Club
    // ────────────────────────────────────────────────
    @GetMapping("/{id}")
    public Club getClub(@PathVariable Long id) {
        return clubService.getClubById(id);
    }

    // ────────────────────────────────────────────────
    // 🏗 Create a Club
    // ────────────────────────────────────────────────
    @PreAuthorize("hasAnyRole('ADMIN', 'CHAIRMAN')")
    @PostMapping
    public ResponseEntity<?> createClub(@RequestBody Club club, @RequestHeader("Authorization") String tokenHeader) {
        String token = tokenHeader.substring(7);
        String email = jwtService.extractEmail(token);
        User creator = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Chairman can only create a club for their own university
        if (creator.getRole().equals("CHAIRMAN")) {
            club.setChairman(creator);
            club.setUniversity(creator.getUniversity());
        }

        Club saved = clubService.createClub(club);
        return ResponseEntity.ok(saved);
    }

    // ────────────────────────────────────────────────
    // ✏️ Update Club (Chairman or Admin)
    // ────────────────────────────────────────────────
    @PreAuthorize("hasAnyRole('ADMIN', 'CHAIRMAN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateClub(
            @PathVariable Long id,
            @RequestBody Club updatedClub,
            @RequestHeader("Authorization") String tokenHeader) {

        String token = tokenHeader.substring(7);
        String email = jwtService.extractEmail(token);
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Club existingClub = clubService.getClubById(id);

        if (user.getRole().equals("CHAIRMAN") && !existingClub.getChairman().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only the chairman of this club can update it."));
        }

        existingClub.setName(updatedClub.getName());
        existingClub.setDescription(updatedClub.getDescription());
        Club saved = clubRepository.save(existingClub);
        return ResponseEntity.ok(saved);
    }

    // ────────────────────────────────────────────────
    // 🗑 Delete Club (Admin only)
    // ────────────────────────────────────────────────
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClub(@PathVariable Long id) {
        clubService.deleteClub(id);
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
    // ❤️ Follow a Club (Student/Chairman)
    // ────────────────────────────────────────────────
    @PreAuthorize("hasAnyRole('STUDENT', 'CHAIRMAN')")
    @PostMapping("/{clubId}/follow")
    public ResponseEntity<?> followClub(@PathVariable Long clubId, @RequestHeader("Authorization") String tokenHeader) {
        String token = tokenHeader.substring(7);
        String email = jwtService.extractEmail(token);
        User follower = userService.findByEmail(email).orElseThrow();

        Club club = clubService.getClubById(clubId);
        club.getFollowers().add(follower);
        clubRepository.save(club);

        return ResponseEntity.ok(Map.of("message", "You are now following " + club.getName()));
    }

    // ────────────────────────────────────────────────
    // 💔 Unfollow Club
    // ────────────────────────────────────────────────
    @PreAuthorize("hasAnyRole('STUDENT', 'CHAIRMAN')")
    @PostMapping("/{clubId}/unfollow")
    public ResponseEntity<?> unfollowClub(@PathVariable Long clubId, @RequestHeader("Authorization") String tokenHeader) {
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
    // 🖼 Upload Club Profile Picture (Chairman only)
    // ────────────────────────────────────────────────
    @PreAuthorize("hasAnyRole('ADMIN','CHAIRMAN')")
    @PostMapping("/{clubId}/upload-profile-pic")
    public ResponseEntity<?> uploadClubProfilePic(
            @PathVariable Long clubId,
            @RequestParam("file") MultipartFile file,
            @RequestHeader("Authorization") String tokenHeader) {

        String token = tokenHeader.substring(7);
        String email = jwtService.extractEmail(token);
        User user = userService.findByEmail(email).orElseThrow();

        Club club = clubService.getClubById(clubId);

        if (user.getRole().equals("CHAIRMAN") && !club.getChairman().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only chairman can update club picture"));
        }

        String imageUrl = s3Service.uploadFile(file, "club-profile-pics/");
        club.setProfilePicUrl(imageUrl);
        clubRepository.save(club);

        return ResponseEntity.ok(Map.of("message", "Club profile picture updated", "url", imageUrl));
    }
}
