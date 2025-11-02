package thareesha.campusTalk.controller;

import thareesha.campusTalk.model.*;
import thareesha.campusTalk.repository.*;
import thareesha.campusTalk.security.JwtService;
import thareesha.campusTalk.service.S3Service;
import thareesha.campusTalk.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin
public class PostController {

    @Autowired private PostRepository postRepository;
    @Autowired private ClubRepository clubRepository;
    @Autowired private CommentRepository commentRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private UserService userService;
    @Autowired private JwtService jwtService;
    @Autowired private S3Service s3Service;

    // ────────────────────────────────────────────────
    // 🧱 Create Post (Chairman/Admin only)
    // ────────────────────────────────────────────────
    @PreAuthorize("hasAnyRole('CHAIRMAN','ADMIN')")
    @PostMapping("/club/{clubId}")
    public ResponseEntity<?> createPost(
            @PathVariable Long clubId,
            @RequestParam("content") String content,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestHeader("Authorization") String tokenHeader) {

        String token = tokenHeader.substring(7);
        String email = jwtService.extractEmail(token);
        User author = userService.findByEmail(email).orElseThrow();
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club not found"));

        // 🧠 Validate role and ownership
        if (author.getRole().equals("CHAIRMAN") && !club.getChairman().getId().equals(author.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You can only post for your own club"));
        }

        // ✅ Upload optional image to S3
        String imageUrl = null;
        if (file != null && !file.isEmpty()) {
            imageUrl = s3Service.uploadFile(file, "club-posts/");
        }

        Post post = new Post();
        post.setUser(author);
        post.setClub(club);
        post.setContent(content);
        post.setImageUrl(imageUrl);
        post.setCreatedAt(LocalDateTime.now());
        post.setLikes(0);

        postRepository.save(post);
        return ResponseEntity.ok(post);
    }

    // ────────────────────────────────────────────────
    // 🧩 Get All Posts
    // ────────────────────────────────────────────────
    @GetMapping
    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    // ────────────────────────────────────────────────
    // 🧩 Get Posts by Club
    // ────────────────────────────────────────────────
    @GetMapping("/club/{clubId}")
    public ResponseEntity<List<Post>> getClubPosts(@PathVariable Long clubId) {
        List<Post> posts = postRepository.findByClubIdOrderByCreatedAtDesc(clubId);
        return ResponseEntity.ok(posts);
    }

    // ────────────────────────────────────────────────
    // 🧩 Feed (Followed Clubs)
    // ────────────────────────────────────────────────
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/feed")
    public ResponseEntity<?> getUserFeed(@RequestHeader("Authorization") String tokenHeader) {
        String token = tokenHeader.substring(7);
        String email = jwtService.extractEmail(token);
        User user = userService.findByEmail(email).orElseThrow();

        Set<Club> followed = user.getFollowedClubs();
        if (followed.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        List<Long> clubIds = followed.stream().map(Club::getId).toList();
        List<Post> feedPosts = postRepository.findByClubIdInOrderByCreatedAtDesc(clubIds);

        return ResponseEntity.ok(feedPosts);
    }

    // ────────────────────────────────────────────────
    // ❤️ Like/Unlike Post
    // ────────────────────────────────────────────────
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{postId}/like")
    public ResponseEntity<?> toggleLike(
            @PathVariable Long postId,
            @RequestHeader("Authorization") String tokenHeader) {

        String token = tokenHeader.substring(7);
        String email = jwtService.extractEmail(token);
        User user = userService.findByEmail(email).orElseThrow();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Simple like counter for now (optional: create PostLike entity)
        post.setLikes(post.getLikes() + 1);
        postRepository.save(post);

        return ResponseEntity.ok(Map.of("likes", post.getLikes()));
    }

    // ────────────────────────────────────────────────
    // 💬 Comment on Post
    // ────────────────────────────────────────────────
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{postId}/comment")
    public ResponseEntity<?> commentOnPost(
            @PathVariable Long postId,
            @RequestBody Map<String, String> payload,
            @RequestHeader("Authorization") String tokenHeader) {

        String token = tokenHeader.substring(7);
        String email = jwtService.extractEmail(token);
        User user = userService.findByEmail(email).orElseThrow();

        String text = payload.get("text");
        if (text == null || text.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Comment cannot be empty"));
        }

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setText(text);
        comment.setCreatedAt(LocalDateTime.now());
        commentRepository.save(comment);

        return ResponseEntity.ok(comment);
    }
    
    
    @GetMapping("/followed")
    @PreAuthorize("hasAnyRole('STUDENT', 'CHAIRMAN', 'ADMIN')")
    public List<Post> getFollowedClubPosts(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Set<Club> clubs = user.getFollowedClubs();
        return postRepository.findByClubInOrderByCreatedAtDesc(clubs);
    }

    
    
    
    

    // ────────────────────────────────────────────────
    // 🗑 Delete Post (Admin or Post Owner)
    // ────────────────────────────────────────────────
    @PreAuthorize("hasAnyRole('ADMIN','CHAIRMAN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(
            @PathVariable Long id,
            @RequestHeader("Authorization") String tokenHeader) {

        String token = tokenHeader.substring(7);
        String email = jwtService.extractEmail(token);
        User user = userService.findByEmail(email).orElseThrow();

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (user.getRole().equals("CHAIRMAN") && !post.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You can only delete your own posts"));
        }

        postRepository.delete(post);
        return ResponseEntity.ok(Map.of("message", "Post deleted successfully"));
    }
}
