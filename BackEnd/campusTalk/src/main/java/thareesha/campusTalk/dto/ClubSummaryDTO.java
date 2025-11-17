package thareesha.campusTalk.dto;

import java.util.List;

// Simple DTO for returning club summary info to frontend.
// Includes followerIds so frontend can optionally compute follow status safely.
public class ClubSummaryDTO {

    private Long id;
    private String name;
    private String profilePicUrl;
    private int followerCount;
    private boolean isFollowing;
    private List<Long> followerIds;

    // Required by Jackson
    public ClubSummaryDTO() {}

    // Primary constructor used by controller
    public ClubSummaryDTO(Long id,
                          String name,
                          String profilePicUrl,
                          int followerCount,
                          boolean isFollowing,
                          List<Long> followerIds) {
        this.id = id;
        this.name = name;
        this.profilePicUrl = profilePicUrl;
        this.followerCount = followerCount;
        this.isFollowing = isFollowing;
        this.followerIds = followerIds;
    }

    // Backwards-compatible convenience constructor (no followerIds)
    public ClubSummaryDTO(Long id,
                          String name,
                          String profilePicUrl,
                          int followerCount,
                          boolean isFollowing) {
        this(id, name, profilePicUrl, followerCount, isFollowing, null);
    }

    // ---------- getters & setters ----------
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getProfilePicUrl() { return profilePicUrl; }
    public void setProfilePicUrl(String profilePicUrl) { this.profilePicUrl = profilePicUrl; }

    public int getFollowerCount() { return followerCount; }
    public void setFollowerCount(int followerCount) { this.followerCount = followerCount; }

    // Jackson-compatible boolean getter naming
    public boolean isFollowing() { return isFollowing; }
    public void setFollowing(boolean following) { isFollowing = following; }

    public List<Long> getFollowerIds() { return followerIds; }
    public void setFollowerIds(List<Long> followerIds) { this.followerIds = followerIds; }
}
