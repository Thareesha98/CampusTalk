package thareesha.campusTalk.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import thareesha.campusTalk.model.ClubMember;
import thareesha.campusTalk.service.ClubMemberService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/club-members")
@CrossOrigin("*")
public class ClubMemberController {

    @Autowired
    private ClubMemberService clubMemberService;

    @GetMapping
    public List<ClubMember> getAllMembers() {
        return clubMemberService.getAllMembers();
    }

    @GetMapping("/{id}")
    public ClubMember getMemberById(@PathVariable Long id) {
        return clubMemberService.getMemberById(id);
    }

    @GetMapping("/club/{clubId}")
    public List<ClubMember> getMembersByClub(@PathVariable Long clubId) {
        return clubMemberService.getMembersByClub(clubId);
    }

    @GetMapping("/user/{userId}")
    public List<ClubMember> getMembersByUser(@PathVariable Long userId) {
        return clubMemberService.getMembersByUser(userId);
    }

    @PostMapping
    public ClubMember addMember(@RequestBody Map<String, Object> payload) {
        Long clubId = Long.parseLong(payload.get("clubId").toString());
        Long userId = Long.parseLong(payload.get("userId").toString());
        String role = payload.get("role").toString();

        return clubMemberService.addMember(clubId, userId, role);
    }

    @PutMapping("/{id}")
    public ClubMember updateMember(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        String newRole = payload.get("role").toString();
        return clubMemberService.updateMember(id, newRole);
    }

    @DeleteMapping("/{id}")
    public void deleteMember(@PathVariable Long id) {
        clubMemberService.deleteMember(id);
    }
}
