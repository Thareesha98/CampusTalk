package thareesha.campusTalk.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import thareesha.campusTalk.dto.RegisterRequest;
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
@CrossOrigin("*")
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


    // ✅ REGISTER
//    @PostMapping("/register")
//    public ResponseEntity<?> register(@RequestBody User user) {
//        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
//            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
//        }
//        
//        System.out.println("🔍 Received user: " + user.getEmail() + " | password=" + user.getPassword());
//
//
//        user.setPassword(passwordEncoder.encode(user.getPassword()));
//
//        if (user.getUniversity() != null && user.getUniversity().getName() != null) {
//            University uni = universityRepository.findByName(user.getUniversity().getName())
//                    .orElseThrow(() -> new RuntimeException("University not found: " + user.getUniversity().getName()));
//            user.setUniversity(uni);
//        } else {
//            return ResponseEntity.badRequest().body(Map.of("error", "University is required"));
//        }
//
//        userRepository.save(user);
//        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
//    }
    
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
        }

        University uni = universityRepository.findByName(req.getUniversityName())
                .orElseThrow(() -> new RuntimeException("University not found: " + req.getUniversityName()));

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(req.getRole());
        user.setUniversity(uni);

        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }


    // ✅ LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        // Authenticate user
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.get("email"),
                        request.get("password")
                )
        );

        UserDetails userDetails = (UserDetails) auth.getPrincipal();

        // Find user entity
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate tokens
        String accessToken = jwtService.generateAccessToken(user.getEmail());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return ResponseEntity.ok(Map.of(
        		"id", user.getId(),
        	    "name", user.getName(),
                "accessToken", accessToken,
                "refreshToken", refreshToken.getToken(),
                "email", user.getEmail(),
                "role", user.getRole(),
                "university",user.getUniversity()
        ));
    }

    // ✅ REFRESH TOKEN
    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        String requestToken = request.get("refreshToken");

        RefreshToken refreshToken = refreshTokenService.findByToken(requestToken)
                .map(refreshTokenService::verifyExpiration)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        String newAccessToken = jwtService.generateAccessToken(refreshToken.getUser().getEmail());

        return ResponseEntity.ok(Map.of(
                "accessToken", newAccessToken,
                "refreshToken", requestToken
        ));
    }
}

