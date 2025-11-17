package thareesha.campusTalk.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import thareesha.campusTalk.model.User;
import thareesha.campusTalk.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {
	
	
	@Autowired
	UserRepository userRepository;

    private static final String SECRET = "supersecretkeyforjwtsigning123456789012345";

    // Short-lived access token (e.g., 15 minutes)
    private static final long ACCESS_EXPIRATION_TIME = 1000 * 60 * 30;

    // Long-lived refresh token (e.g., 7 days)
    private static final long REFRESH_EXPIRATION_TIME = 1000L * 60 * 60 * 24 * 7;

    private Key getSignKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    // ✅ Generate short-lived access token
    public String generateAccessToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_EXPIRATION_TIME))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // ✅ Generate long-lived refresh token
    public String generateRefreshToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_EXPIRATION_TIME))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    
    

    public String extractEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean isTokenValid(String token, String email) {
        String extracted = extractEmail(token);
        return (extracted.equals(email) && !isTokenExpired(token));
    }
    
    
    
    
    
    public Long extractUserIdFromRequest(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            String email = extractEmail(token);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found for email: " + email));
            return user.getId();
        }
        throw new RuntimeException("Invalid or missing token");
    }

    
    
    
    

    private boolean isTokenExpired(String token) {
        Date expiration = Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
        return expiration.before(new Date());
    }

    // Optional helper to check type (for debugging/logging)
    public boolean isRefreshToken(String token) {
        try {
            Date issued = Jwts.parserBuilder()
                    .setSigningKey(getSignKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getIssuedAt();
            Date exp = Jwts.parserBuilder()
                    .setSigningKey(getSignKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getExpiration();
            long duration = exp.getTime() - issued.getTime();
            return duration > ACCESS_EXPIRATION_TIME;
        } catch (Exception e) {
            return false;
        }
    }
    
    public Long extractUserId(String token) {
        if (token == null || token.isBlank()) {
            return null;
        }

        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            String email = extractEmail(token);

            return userRepository.findByEmail(email)
                    .map(User::getId)
                    .orElse(null);

        } catch (Exception e) {
            return null;
        }
    }

    
    
}

