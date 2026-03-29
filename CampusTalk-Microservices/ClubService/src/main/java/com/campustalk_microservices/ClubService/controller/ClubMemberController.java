package com.campustalk_microservices.ClubService.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import com.campustalk_microservices.ClubService.model.ClubMember;
import com.campustalk_microservices.ClubService.service.ClubMemberService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/club-members")
@RequiredArgsConstructor
public class ClubMemberController {

    private final ClubMemberService service;

    @GetMapping
    public List<ClubMember> getAll() {
        return service.getAllMembers();
    }

    @PostMapping
    public ClubMember add(@RequestBody Map<String, Object> payload) {
        return service.addMember(
                Long.parseLong(payload.get("clubId").toString()),
                Long.parseLong(payload.get("userId").toString()),
                payload.get("role").toString()
        );
    }
}