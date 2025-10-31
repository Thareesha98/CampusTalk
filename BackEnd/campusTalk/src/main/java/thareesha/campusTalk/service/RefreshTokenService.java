package thareesha.campusTalk.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import thareesha.campusTalk.model.RefreshToken;
import thareesha.campusTalk.model.User;
import thareesha.campusTalk.repository.RefreshTokenRepository;
import thareesha.campusTalk.repository.UserRepository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    // read raw string (avoid conversion error)
    @Value("${jwt.refresh-expiration-ms:604800000}")
    private String refreshTokenDurationMsRaw;

    // internal long value used by service
    private Long refreshTokenDurationMs;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository, UserRepository userRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
    }

    @PostConstruct
    private void init() {
        // sanitize: keep only leading digits
        if (refreshTokenDurationMsRaw == null) {
            refreshTokenDurationMs = 604800000L; // safe default 7 days
        } else {
            String digits = refreshTokenDurationMsRaw.replaceAll("^\\D*(\\d+).*", "$1");
            try {
                refreshTokenDurationMs = Long.parseLong(digits);
            } catch (Exception e) {
                // fallback to default if parsing fails
                refreshTokenDurationMs = 604800000L;
            }
        }
        System.out.println("🔹 refreshTokenDurationMs loaded (ms) = " + refreshTokenDurationMs);
    }

    public RefreshToken createRefreshToken(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // optionally remove old refresh tokens for this user
        refreshTokenRepository.deleteByUser(user);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
        refreshToken.setToken(UUID.randomUUID().toString());
        return refreshTokenRepository.save(refreshToken);
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    public void deleteByUser(User user) {
        refreshTokenRepository.deleteByUser(user);
    }
}

