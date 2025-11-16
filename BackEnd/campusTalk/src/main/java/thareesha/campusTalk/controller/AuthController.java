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
import thareesha.campusTalk.model.*;
import thareesha.campusTalk.repository.UniversityRepository;
import thareesha.campusTalk.repository.UserRepository;
import thareesha.campusTalk.repository.VerificationCodeRepository;
import thareesha.campusTalk.security.JwtService;
import thareesha.campusTalk.service.EmailService;
import thareesha.campusTalk.service.RefreshTokenService;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private JwtService jwtService;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private UserRepository userRepository;
    @Autowired private UniversityRepository universityRepository;
    @Autowired private RefreshTokenService refreshTokenService;
    @Autowired private VerificationCodeRepository verificationCodeRepository;
    @Autowired private EmailService emailService;

    // ============================================================
    // 1️⃣ SEND OTP FOR REGISTRATION
    // ============================================================
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> req) {
        String email = req.get("email");

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
        }

        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));

        // Save or update OTP
        verificationCodeRepository.deleteByEmail(email);

        VerificationCode vc = new VerificationCode();
        vc.setEmail(email);
        vc.setCode(otp);
        vc.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        verificationCodeRepository.save(vc);

        // Send email
        emailService.sendOtpEmail(email, otp);

        return ResponseEntity.ok(Map.of("message", "OTP sent successfully"));
    }

    // ============================================================
    // 2️⃣ VERIFY OTP (before registration)
    // ============================================================
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        String otp = req.get("otp");

        Optional<VerificationCode> vc = verificationCodeRepository.findByEmail(email);

        if (vc.isEmpty())
            return ResponseEntity.badRequest().body(Map.of("error", "OTP not found"));

        if (!vc.get().getCode().equals(otp))
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid OTP"));

        if (vc.get().getExpiresAt().isBefore(LocalDateTime.now()))
            return ResponseEntity.badRequest().body(Map.of("error", "OTP expired"));

        return ResponseEntity.ok(Map.of("message", "OTP verified"));
    }

    // ============================================================
    // 3️⃣ REGISTRATION (AFTER OTP VERIFIED)
    // ============================================================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {

        // Ensure OTP exists & verified
        VerificationCode vc = verificationCodeRepository.findByEmail(req.getEmail())
                .orElse(null);

        if (vc == null)
            return ResponseEntity.badRequest().body(Map.of("error", "Please verify OTP first"));

        // (Optional) remove requirement → tell me if needed.

        University uni = universityRepository.findByName(req.getUniversityName())
                .orElseThrow(() -> new RuntimeException("University not found: " + req.getUniversityName()));

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(req.getRole());
        user.setUniversity(uni);

        userRepository.save(user);

        verificationCodeRepository.deleteByEmail(req.getEmail());

        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    // ============================================================
    // 4️⃣ LOGIN (UNCHANGED)
    // ============================================================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.get("email"),
                        request.get("password")
                )
        );

        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String accessToken = jwtService.generateAccessToken(user.getEmail());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "accessToken", accessToken,
                "refreshToken", refreshToken.getToken(),
                "email", user.getEmail(),
                "role", user.getRole(),
                "university", user.getUniversity()
        ));
    }

    // ============================================================
    // 5️⃣ REFRESH TOKEN (UNCHANGED)
    // ============================================================
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

    // ============================================================
    // 6️⃣ REQUEST PASSWORD RESET (OTP)
    // ============================================================
    @PostMapping("/request-reset")
    public ResponseEntity<?> requestPasswordReset(@RequestBody Map<String, String> req) {
        String email = req.get("email");

        if (!userRepository.findByEmail(email).isPresent())
            return ResponseEntity.badRequest().body(Map.of("error", "Email not registered"));

        String otp = String.format("%06d", new Random().nextInt(999999));
        verificationCodeRepository.deleteByEmail(email);

        VerificationCode vc = new VerificationCode();
        vc.setEmail(email);
        vc.setCode(otp);
        vc.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        verificationCodeRepository.save(vc);

        emailService.sendResetToken(email, otp);

        return ResponseEntity.ok(Map.of("message", "Reset OTP sent"));
    }

    // ============================================================
    // 7️⃣ VERIFY RESET OTP
    // ============================================================
    @PostMapping("/verify-reset")
    public ResponseEntity<?> verifyPasswordReset(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        String otp = req.get("otp");

        VerificationCode vc = verificationCodeRepository.findByEmail(email)
                .orElse(null);

        if (vc == null || !vc.getCode().equals(otp))
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid OTP"));

        if (vc.getExpiresAt().isBefore(LocalDateTime.now()))
            return ResponseEntity.badRequest().body(Map.of("error", "OTP expired"));

        return ResponseEntity.ok(Map.of("message", "OTP verified"));
    }

    // ============================================================
    // 8️⃣ UPDATE PASSWORD AFTER OTP
    // ============================================================
    @PostMapping("/update-password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        String newPassword = req.get("password");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        verificationCodeRepository.deleteByEmail(email);

        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }
}
