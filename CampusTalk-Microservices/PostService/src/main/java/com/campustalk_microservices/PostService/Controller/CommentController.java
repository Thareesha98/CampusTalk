package com.campustalk_microservices.PostService.Controller;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import com.campustalk_microservices.PostService.model.Comment;
import com.campustalk_microservices.PostService.service.CommentService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService service;

    @PostMapping
    public Comment add(@RequestBody Map<String, String> body) {
        return service.add(
                Long.parseLong(body.get("postId")),
                Long.parseLong(body.get("userId")),
                body.get("text")
        );
    }

    @GetMapping("/post/{postId}")
    public List<Comment> get(@PathVariable Long postId) {
        return service.getByPost(postId);
    }
}