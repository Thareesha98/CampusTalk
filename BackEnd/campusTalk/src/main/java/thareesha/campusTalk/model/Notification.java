package thareesha.campusTalk.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;

    private String type; // POST, EVENT, LIKE, COMMENT

    private boolean read = false;

    private LocalDateTime createdAt = LocalDateTime.now();

    // 🔗 Receiver
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"notifications", "password", "followedClubs", "posts"})
    private User user;

    // Optional reference (e.g., post/event ID)
    private Long referenceId;
}
