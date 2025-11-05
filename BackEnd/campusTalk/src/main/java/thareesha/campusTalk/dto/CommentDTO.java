package thareesha.campusTalk.dto;

import java.time.LocalDateTime;

public class CommentDTO {
    private Long id;
    private String text;
    private LocalDateTime createdAt;
    private String userName;
    private String userProfilePicUrl;

    public CommentDTO(Long id, String text, LocalDateTime createdAt, String userName, String userProfilePicUrl) {
        this.id = id;
        this.text = text;
        this.createdAt = createdAt;
        this.userName = userName;
        this.userProfilePicUrl = userProfilePicUrl;
    }

    // Getters
    public Long getId() { return id; }
    public String getText() { return text; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getUserName() { return userName; }
    public String getUserProfilePicUrl() { return userProfilePicUrl; }
}
