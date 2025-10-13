
package thareesha.campusTalk.service;

import thareesha.campusTalk.model.Club;
import thareesha.campusTalk.model.ClubMember;
import thareesha.campusTalk.model.User;
import thareesha.campusTalk.repository.ClubMemberRepository;
import thareesha.campusTalk.repository.ClubRepository;
import thareesha.campusTalk.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClubService {

    @Autowired
    private ClubRepository clubRepository;
    
    @Autowired
    private UserRepository userRepository;

    public List<Club> getAllClubs() {
        return clubRepository.findAll();
    }

    public Club getClubById(Long id) {
        return clubRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Club not found with id: " + id));
    }

    public Club createClub(Club club) {
        return clubRepository.save(club);
    }

    public Club updateClub(Long id, Club updatedClub) {
        return clubRepository.findById(id).map(club -> {
            club.setName(updatedClub.getName());
            club.setDescription(updatedClub.getDescription());
            // your Club model has chairman (User), not chairmanId
            club.setChairman(updatedClub.getChairman());
            return clubRepository.save(club);
        }).orElseThrow(() -> new RuntimeException("Club not found with id: " + id));
    }

    public void deleteClub(Long id) {
        if (!clubRepository.existsById(id)) {
            throw new RuntimeException("Club not found with id: " + id);
        }
        clubRepository.deleteById(id);
    }
    
    public List<Club> getClubsByUniversity(Long universityId) {
        return clubRepository.findAll()
                .stream()
                .filter(c -> c.getUniversity() != null && c.getUniversity().getId().equals(universityId))
                .toList();
    }
    
    @Autowired
    private ClubMemberRepository clubMemberRepository;

    public ClubMember addMember(Long clubId, Long userId, String role) {
        Club club = getClubById(clubId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ClubMember member = new ClubMember();
        member.setClub(club);
        member.setUser(user);
        member.setRole(role);

        // Save using ClubMemberRepository
        return clubMemberRepository.save(member);
    }



    // ✅ NEW: Remove member
    public Club removeMember(Long clubId, Long userId) {
        Club club = getClubById(clubId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        club.getMembers().remove(user);
        return clubRepository.save(club);
    }

    public List<User> getClubUsers(Long clubId) {
        Club club = getClubById(clubId);
        return club.getMembers()
                   .stream()
                   .map(ClubMember::getUser)
                   .toList();
    }

    public void removeMemberFromClub(Long clubId, Long userId) {
        Club club = getClubById(clubId);
        club.getMembers().removeIf(cm -> cm.getUser().getId().equals(userId));
    }

}
