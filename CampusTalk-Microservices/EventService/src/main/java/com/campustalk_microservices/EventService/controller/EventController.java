package com.campustalk_microservices.EventService.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import com.campustalk_microservices.EventService.model.Event;
import com.campustalk_microservices.EventService.service.EventService;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService service;

    @GetMapping
    public List<Event> all() {
        return service.getAllEvents();
    }

    @GetMapping("/{id}")
    public Event get(@PathVariable Long id) {
        return service.getEvent(id);
    }

    @PostMapping
    public Event create(@RequestBody Event event) {
        return service.create(event);
    }

    @PutMapping("/{id}")
    public Event update(@PathVariable Long id, @RequestBody Event event) {
        return service.update(id, event);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}