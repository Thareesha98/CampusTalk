package thareesha.campusTalk.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import thareesha.campusTalk.model.RefreshToken;
import thareesha.campusTalk.model.University;
import thareesha.campusTalk.model.User;
import thareesha.campusTalk.repository.UniversityRepository;
import thareesha.campusTalk.repository.UserRepository;
import thareesha.campusTalk.security.JwtService;
import thareesha.campusTalk.service.RefreshTokenService;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UniversityRepository universityRepository;
    
    @Autowired
    private RefreshTokenService refreshTokenService;

//    // ✅ REGISTER new user
//    @PostMapping("/register")
//    public ResponseEntity<?> register(@RequestBody User user) {
//        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
//            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
//        }
//
//        user.setPassword(passwordEncoder.encode(user.getPassword())); // hash password
//        userRepository.save(user);
//        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
//    }
    
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        // Check if email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
        }

        // 🔐 Hash password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // 🎓 Link university
        if (user.getUniversity() != null && user.getUniversity().getName() != null) {
            University uni = universityRepository.findByName(user.getUniversity().getName())
                    .orElseThrow(() -> new RuntimeException("University not found: " + user.getUniversity().getName()));
            user.setUniversity(uni);
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "University is required"));
        }

        // Save user
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }


    // ✅ LOGIN existing user
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.get("email"),
                        request.get("password")
                )
        );

        UserDetails user = (UserDetails) auth.getPrincipal();
        String token = jwtService.generateToken(user.getUsername());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "email", user.getUsername(),
                "role", user.getAuthorities()
        ));
    }
    
    
    
    
    
    
    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        String requestToken = request.get("refreshToken");
        RefreshToken refreshToken = refreshTokenService.findByToken(requestToken)
                .map(refreshTokenService::verifyExpiration)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        String newAccessToken = jwtService.generateToken(refreshToken.getUser().getEmail());

        return ResponseEntity.ok(Map.of(
                "accessToken", newAccessToken,
                "refreshToken", requestToken
        ));
    }

    
    
    
}
