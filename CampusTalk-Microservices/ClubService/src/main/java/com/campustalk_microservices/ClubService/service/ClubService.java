package com.campustalk_microservices.ClubService.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.campustalk_microservices.ClubService.model.Club;
import com.campustalk_microservices.ClubService.repository.ClubRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClubService {

    private final ClubRepository clubRepository;

    public List<Club> getAllClubs() {
        return clubRepository.findAll();
    }

    public Club getClubById(Long id) {
        return clubRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Club not found"));
    }

    public Club createClub(Club club) {
        return clubRepository.save(club);
    }

    public void deleteClub(Long id) {
        clubRepository.deleteById(id);
    }

    public List<Club> getClubsByUniversity(Long universityId) {
        return clubRepository.findByUniversityId(universityId);
    }

    public boolean toggleJoinClub(Long clubId, Long userId) {
        Club club = getClubById(clubId);

        boolean joined;
        if (club.getFollowerIds().contains(userId)) {
            club.getFollowerIds().remove(userId);
            joined = false;
        } else {
            club.getFollowerIds().add(userId);
            joined = true;
        }

        clubRepository.save(club);
        return joined;
    }
}