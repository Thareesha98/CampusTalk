package com.campustalk_microservices.ClubService.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import com.campustalk_microservices.ClubService.model.Club;
import com.campustalk_microservices.ClubService.service.ClubService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clubs")
@RequiredArgsConstructor
public class ClubController {

    private final ClubService clubService;

    @GetMapping
    public List<Club> getAll() {
        return clubService.getAllClubs();
    }

    @GetMapping("/{id}")
    public Club get(@PathVariable Long id) {
        return clubService.getClubById(id);
    }

    @PostMapping
    public Club create(@RequestBody Club club) {
        return clubService.createClub(club);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        clubService.deleteClub(id);
    }

    @PostMapping("/{clubId}/join")
    public Map<String, Object> join(@PathVariable Long clubId, @RequestParam Long userId) {
        boolean joined = clubService.toggleJoinClub(clubId, userId);
        return Map.of("joined", joined);
    }
}