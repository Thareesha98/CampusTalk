package com.campustalk_microservices.EventService.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import com.campustalk_microservices.EventService.model.RSVP;
import com.campustalk_microservices.EventService.service.RSVPService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rsvps")
@RequiredArgsConstructor
public class RSVPController {

    private final RSVPService service;

    @GetMapping("/event/{eventId}")
    public List<RSVP> byEvent(@PathVariable Long eventId) {
        return service.byEvent(eventId);
    }

    @PostMapping("/respond")
    public RSVP respond(@RequestBody Map<String, Object> body) {
        return service.respond(
                Long.parseLong(body.get("eventId").toString()),
                Long.parseLong(body.get("userId").toString()),
                body.get("status").toString()
        );
    }
}