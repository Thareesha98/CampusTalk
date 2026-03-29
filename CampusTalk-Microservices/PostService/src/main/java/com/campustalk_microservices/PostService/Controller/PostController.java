package com.campustalk_microservices.PostService.Controller;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import com.campustalk_microservices.PostService.model.Post;
import com.campustalk_microservices.PostService.service.PostService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService service;

    @GetMapping("/club/{clubId}")
    public List<Post> getByClub(@PathVariable Long clubId) {
        return service.getByClub(clubId);
    }

    @PostMapping
    public Post create(@RequestBody Post post) {
        return service.create(post);
    }

    @PutMapping("/{id}")
    public Post update(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return service.update(id, body.get("content"), body.get("imageUrl"));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @PostMapping("/{id}/like")
    public Post like(@PathVariable Long id) {
        return service.like(id);
    }
}