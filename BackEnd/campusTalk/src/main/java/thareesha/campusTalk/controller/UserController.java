package thareesha.campusTalk.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import thareesha.campusTalk.model.User;
import thareesha.campusTalk.repository.UserRepository;
import thareesha.campusTalk.security.JwtService;
import thareesha.campusTalk.service.S3Service;
import thareesha.campusTalk.service.UserService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private S3Service s3Service;

    @Autowired
    private JwtService jwtService;

    // 🔒 ADMIN only: view all users
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // 🔒 ADMIN or the user themselves can view a specific user
    @PreAuthorize("hasAnyRole('ADMIN', 'CHAIRMAN', 'STUDENT')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        User targetUser = userService.getUserById(id)
                .orElseThrow(() -> new RuntimeException("Target user not found"));

        // 🧠 Allow self or admin
        if (!currentUser.getId().equals(id) && !currentUser.getRole().equals("ADMIN")) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        }

        return ResponseEntity.ok(targetUser);
    }

    // 🔒 ADMIN only: create new users
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    // 🔒 ADMIN or SELF: update user profile
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT', 'CHAIRMAN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User updatedUser, Authentication authentication) {
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!currentUser.getId().equals(id) && !currentUser.getRole().equals("ADMIN")) {
            return ResponseEntity.status(403).body(Map.of("error", "You can only update your own profile"));
        }

        User saved = userService.updateUser(id, updatedUser);
        return ResponseEntity.ok(saved);
    }

    // 🔒 ADMIN only
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    // 🔓 Public or Admin
    @GetMapping("/university/{universityId}")
    public ResponseEntity<List<User>> getUsersByUniversity(@PathVariable Long universityId) {
        return ResponseEntity.ok(userService.getUsersByUniversity(universityId));
    }

    // 👤 Authenticated user profile (self)
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    // 🖼 Upload profile picture — only self
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/upload-profile-pic")
    public ResponseEntity<?> uploadProfilePicture(
            @RequestParam("file") MultipartFile file,
            @RequestHeader("Authorization") String tokenHeader) {

        String token = tokenHeader.substring(7);
        String email = jwtService.extractEmail(token);

        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String imageUrl = s3Service.uploadFile(file, "user-profile-pics/");
        user.setProfilePicUrl(imageUrl);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "message", "Profile picture updated successfully",
                "url", imageUrl
        ));
    }
}
