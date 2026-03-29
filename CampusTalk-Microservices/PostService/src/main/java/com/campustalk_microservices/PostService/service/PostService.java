package com.campustalk_microservices.PostService.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.campustalk_microservices.PostService.model.Post;
import com.campustalk_microservices.PostService.repository.PostRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository repository;

    public List<Post> getByClub(Long clubId) {
        return repository.findByClubIdOrderByCreatedAtDesc(clubId);
    }

    public Post create(Post post) {
        post.setCreatedAt(LocalDateTime.now());
        post.setLikes(0);
        return repository.save(post);
    }

    public Post update(Long id, String content, String imageUrl) {
        Post p = repository.findById(id).orElseThrow();
        p.setContent(content);
        if (imageUrl != null) p.setImageUrl(imageUrl);
        return repository.save(p);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public Post like(Long id) {
        Post p = repository.findById(id).orElseThrow();
        p.setLikes(p.getLikes() + 1);
        return repository.save(p);
    }
}