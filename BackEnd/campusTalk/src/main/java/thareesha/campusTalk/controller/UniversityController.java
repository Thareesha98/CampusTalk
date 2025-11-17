package thareesha.campusTalk.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import thareesha.campusTalk.dto.ClubSummaryDTO;
import thareesha.campusTalk.dto.UniversityListDTO;
import thareesha.campusTalk.model.Club;
import thareesha.campusTalk.model.User;
import thareesha.campusTalk.model.University;
import thareesha.campusTalk.repository.UniversityRepository;
import thareesha.campusTalk.security.JwtService;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/universities")
public class UniversityController {

    @Autowired
    private UniversityRepository universityRepository;

    @Autowired
    private JwtService jwtService;

    @PostMapping
    public ResponseEntity<University> createUniversity(@RequestBody University university) {
        return ResponseEntity.ok(universityRepository.save(university));
    }

    @GetMapping
    public ResponseEntity<List<UniversityListDTO>> getAllUniversities() {

        List<University> list = universityRepository.findAll();

        List<UniversityListDTO> dtoList = list.stream().map(u ->
                new UniversityListDTO(
                        u.getId(),
                        u.getName(),
                        u.getLocation(),
                        u.getImageUrl(),
                        u.getClubs() == null ? 0 : u.getClubs().size(),
                        u.getStudents() == null ? 0 : u.getStudents().size()
                )
        ).toList();

        return ResponseEntity.ok(dtoList);
    }



    @GetMapping("/{id}")
    public ResponseEntity<?> getUniversity(@PathVariable Long id) {
        return ResponseEntity.of(universityRepository.findById(id));
    }

    /**
     * Safely extract userId from optional Authorization header.
     * Returns null when token absent/invalid.
     */
    private Long extractUserIdSafely(String authHeader) {
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                return jwtService.extractUserId(authHeader.substring(7));
            }
        } catch (Exception ignored) {
            // don't propagate — treat as anonymous
        }
        return null;
    }

    /**
     * GET /api/universities/{id}/details
     * - returns university basic info + list of ClubSummaryDTO
     * - safe even when no Authorization header provided
     * - deduplicates clubs deterministically and avoids null Map.of usage
     */
    @GetMapping("/{id}/details")
    public ResponseEntity<?> getUniversityDetails(
            @PathVariable Long id,
            @RequestHeader(name = "Authorization", required = false) String authHeader
    ) {
        Optional<University> uniOpt = universityRepository.fetchWithClubsAndFollowers(id);

        if (uniOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        University uni = uniOpt.get();

        final Long userId = extractUserIdSafely(authHeader);

        // Deduplicate clubs while preserving insertion order (if mapping uses List)
        // Use a LinkedHashMap keyed by club id
        Map<Long, Club> clubById = new LinkedHashMap<>();
        if (uni.getClubs() != null) {
            for (Club c : uni.getClubs()) {
                if (c == null || c.getId() == null) continue;
                // If same club appears multiple times due to fetch-join duplicates,
                // preserve the first and ignore later duplicates.
                clubById.putIfAbsent(c.getId(), c);
            }
        }

        List<ClubSummaryDTO> clubSummaries = clubById.values().stream().map(c -> {
            // Safe extraction of follower IDs
            List<Long> followerIds;
            if (c.getFollowers() == null) {
                followerIds = Collections.emptyList();
            } else {
                followerIds = c.getFollowers().stream()
                        .filter(Objects::nonNull)
                        .map(User::getId)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList());
            }

            int followerCount = followerIds.size();

            boolean isFollowing = false;
            if (userId != null) {
                isFollowing = followerIds.contains(userId);
            }

            return new ClubSummaryDTO(
                    c.getId(),
                    c.getName(),
                    c.getProfilePicUrl(),
                    followerCount,
                    isFollowing,
                    followerIds
            );
        }).collect(Collectors.toList());

        // Build response as a mutable map (avoid Map.of to prevent NPE on nulls)
        Map<String, Object> response = new HashMap<>();
        response.put("id", uni.getId());
        response.put("name", uni.getName());
        response.put("location", uni.getLocation());
        response.put("description", uni.getDescription());
        response.put("logoUrl", uni.getLogoUrl());
        response.put("imageUrl", uni.getImageUrl());
        response.put("studentCount", uni.getStudents() == null ? 0 : uni.getStudents().size());
        response.put("clubs", clubSummaries);

        return ResponseEntity.ok(response);
    }
}
