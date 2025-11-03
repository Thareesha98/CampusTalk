package thareesha.campusTalk.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import thareesha.campusTalk.model.*;
import thareesha.campusTalk.repository.*;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Post> getPostsByClub(Long clubId) {
        return postRepository.findByClubIdOrderByCreatedAtDesc(clubId);
    }

    public Post createPost(Long clubId, Long userId, String content, String imageUrl) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = new Post();
        post.setClub(club);
        post.setUser(user);
        post.setContent(content);
        post.setImageUrl(imageUrl);
        post.setCreatedAt(LocalDateTime.now());
        return postRepository.save(post);
    }

    public Post updatePost(Long postId, String content, String imageUrl) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setContent(content);
        if (imageUrl != null) post.setImageUrl(imageUrl);
        return postRepository.save(post);
    }

    public void deletePost(Long postId) {
        postRepository.deleteById(postId);
    }
}
