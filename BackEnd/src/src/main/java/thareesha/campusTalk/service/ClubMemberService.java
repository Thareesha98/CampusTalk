package thareesha.campusTalk.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import thareesha.campusTalk.model.ClubMember;
import thareesha.campusTalk.repository.ClubMemberRepository;
import thareesha.campusTalk.repository.ClubRepository;
import thareesha.campusTalk.repository.UserRepository;

import java.util.List;

@Service
public class ClubMemberService {

    @Autowired
    private ClubMemberRepository clubMemberRepository;

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ClubMember> getAllMembers() {
        return clubMemberRepository.findAll();
    }

    public ClubMember getMemberById(Long id) {
        return clubMemberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Club member not found"));
    }

    public ClubMember addMember(Long clubId, Long userId, String role) {
        var club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club not found"));

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ClubMember member = new ClubMember();
        member.setClub(club);
        member.setUser(user);
        member.setRole(role);
        club.getMembers().add(member);

        return clubMemberRepository.save(member);
    }

    public ClubMember updateMember(Long id, String newRole) {
        return clubMemberRepository.findById(id).map(member -> {
            member.setRole(newRole);
            return clubMemberRepository.save(member);
        }).orElseThrow(() -> new RuntimeException("Club member not found"));
    }

    public void deleteMember(Long id) {
        clubMemberRepository.deleteById(id);
    }

    public List<ClubMember> getMembersByClub(Long clubId) {
        return clubMemberRepository.findByClubId(clubId);
    }

    public List<ClubMember> getMembersByUser(Long userId) {
        return clubMemberRepository.findByUserId(userId);
    }
}
