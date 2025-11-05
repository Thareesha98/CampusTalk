package thareesha.campusTalk.dto;

import java.time.LocalDateTime;
import java.util.List;

public class PostResponseDTO {
    private Long id;
    private String content;
    private String imageUrl;
    private int likes;
    private LocalDateTime createdAt;
    private String userName;
    private String userProfilePicUrl;
    private List<CommentDTO> comments;

    public PostResponseDTO(Long id, String content, String imageUrl, int likes,
                           LocalDateTime createdAt, String userName, String userProfilePicUrl,
                           List<CommentDTO> comments) {
        this.id = id;
        this.content = content;
        this.imageUrl = imageUrl;
        this.likes = likes;
        this.createdAt = createdAt;
        this.userName = userName;
        this.userProfilePicUrl = userProfilePicUrl;
        this.comments = comments;
    }

    // Getters only (immutability pattern)
    public Long getId() { return id; }
    public String getContent() { return content; }
    public String getImageUrl() { return imageUrl; }
    public int getLikes() { return likes; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getUserName() { return userName; }
    public String getUserProfilePicUrl() { return userProfilePicUrl; }
    public List<CommentDTO> getComments() { return comments; }
}
