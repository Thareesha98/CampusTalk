package thareesha.campusTalk.controller;

import thareesha.campusTalk.model.Club;
import thareesha.campusTalk.service.ClubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clubs")
@CrossOrigin
public class ClubController {

    @Autowired
    private ClubService clubService;

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
}
