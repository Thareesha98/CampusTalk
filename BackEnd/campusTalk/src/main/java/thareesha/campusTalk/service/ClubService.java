
package thareesha.campusTalk.service;

import thareesha.campusTalk.model.Club;
import thareesha.campusTalk.model.ClubMember;
import thareesha.campusTalk.model.University;
import thareesha.campusTalk.model.User;
import thareesha.campusTalk.repository.ClubMemberRepository;
import thareesha.campusTalk.repository.ClubRepository;
import thareesha.campusTalk.repository.UniversityRepository;
import thareesha.campusTalk.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClubService {

    @Autowired
    private ClubRepository clubRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UniversityService universityService;


    public List<Club> getAllClubs() {
        return clubRepository.findAll();
    }
    
    @Cacheable("clubs")
    public Page<Club> getAllClubs(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());
        return clubRepository.findAll(pageable);
    }
    

    public Club getClubById(Long id) {
        return clubRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Club not found with id: " + id));
    }

    public Club createClub(Club club) {
        return clubRepository.save(club);
    }
    
    
    
    @Autowired
    private UniversityRepository universityRepository;

    public University findUniversityById(Long id) {
        return universityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("University not found with id: " + id));
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
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
 // ────────────────────────────────────────────────
 // ❤️ JOIN / LEAVE CLUB (Followers Handling)
 // ────────────────────────────────────────────────
 public boolean toggleJoinClub(Long clubId, Long userId) {
     Club club = getClubById(clubId);
     User user = userRepository.findById(userId)
             .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

     boolean joined;
     if (club.getFollowers().contains(user)) {
         club.getFollowers().remove(user);
         joined = false;
     } else {
         club.getFollowers().add(user);
         joined = true;
     }
     clubRepository.save(club);
     return joined;
 }

 // ────────────────────────────────────────────────
 // 📜 Get Clubs Joined by User
 // ────────────────────────────────────────────────
 public List<Club> getJoinedClubs(Long userId) {
     User user = userRepository.findById(userId)
             .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
     return user.getFollowedClubs().stream().toList();
 }

    
    
    
    
    
    
    
    
    

}
