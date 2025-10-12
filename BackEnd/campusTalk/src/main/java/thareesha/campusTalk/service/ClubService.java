
package thareesha.campusTalk.service;

import thareesha.campusTalk.model.Club;
import thareesha.campusTalk.repository.ClubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClubService {

    @Autowired
    private ClubRepository clubRepository;

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
}
