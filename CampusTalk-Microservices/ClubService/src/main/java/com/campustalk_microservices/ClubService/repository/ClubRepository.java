package com.campustalk_microservices.ClubService.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.campustalk_microservices.ClubService.model.Club;

import java.util.List;

public interface ClubRepository extends JpaRepository<Club, Long> {
    List<Club> findByUniversityId(Long universityId);
}