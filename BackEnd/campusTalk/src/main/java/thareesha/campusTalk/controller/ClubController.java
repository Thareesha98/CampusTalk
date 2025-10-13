package thareesha.campusTalk.controller;

import thareesha.campusTalk.model.Club;
import thareesha.campusTalk.model.ClubMember;
import thareesha.campusTalk.model.User;
import thareesha.campusTalk.service.ClubMemberService;
import thareesha.campusTalk.service.ClubService;
import thareesha.campusTalk.service.UserService;
import thareesha.campusTalk.security.JwtService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clubs")
@CrossOrigin
public class ClubController {

    @Autowired
    private ClubService clubService;
    
    @Autowired
    private ClubMemberService clubMemberService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    // ─── Club CRUD ─────────────────────────────
    @GetMapping
    public List<Club> getAllClubs() {
        return clubService.getAllClubs();
    }

    @GetMapping("/{id}")
    public Club getClub(@PathVariable Long id) {
        return clubService.getClubById(id);
    }

    @PostMapping
    public Club createClub(@RequestBody Club club) {
        return clubService.createClub(club);
    }

    @PutMapping("/{id}")
    public Club updateClub(@PathVariable Long id, @RequestBody Club club) {
        return clubService.updateClub(id, club);
    }

    @DeleteMapping("/{id}")
    public void deleteClub(@PathVariable Long id) {
        clubService.deleteClub(id);
    }

    @GetMapping("/university/{universityId}")
    public ResponseEntity<List<Club>> getClubsByUniversity(@PathVariable Long universityId) {
        return ResponseEntity.ok(clubService.getClubsByUniversity(universityId));
    }

    // ─── Club Membership ─────────────────────────────
    @PostMapping("/{clubId}/join")
    public ResponseEntity<?> joinClub(@PathVariable Long clubId, @RequestHeader("Authorization") String tokenHeader) {
        String token = tokenHeader.substring(7);
        String email = jwtService.extractEmail(token);
        User user = userService.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        clubMemberService.addMember(clubId, user.getId(), "Member"); // or default role

        return ResponseEntity.ok("Joined club successfully");
    }

 // ─── Leave Club ─────────────────────────────
    @PostMapping("/{clubId}/leave")
    public ResponseEntity<?> leaveClub(@PathVariable Long clubId, @RequestHeader("Authorization") String tokenHeader) {
        // Extract user email from JWT
        String token = tokenHeader.substring(7);
        String email = jwtService.extractEmail(token);
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Find the ClubMember object for this user in this club
        ClubMember member = clubMemberService.getMembersByClub(clubId)
                .stream()
                .filter(m -> m.getUser().getId().equals(user.getId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("User is not a member of this club"));

        // Delete the membership
        clubMemberService.deleteMember(member.getId());

        return ResponseEntity.ok("Left club successfully");
    }

    // ─── Get Club Members ─────────────────────────────
    @GetMapping("/{clubId}/members")
    public ResponseEntity<List<User>> getClubMembers(@PathVariable Long clubId) {
        // Get all ClubMember objects for the club, then extract User
        List<User> users = clubMemberService.getMembersByClub(clubId)
                .stream()
                .map(ClubMember::getUser)
                .toList();

        return ResponseEntity.ok(users);
    }

}

