package thareesha.campusTalk.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;

@Entity
@Table(name = "club_members")
public class ClubMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "club_id")
    @JsonBackReference  // "back" part of reference, ignore when serializing ClubMember
    private Club club;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String role; // eg: "President", "Secretary", "Member"

    public ClubMember() {}

    public ClubMember(Club club, User user, String role) {
        this.club = club;
        this.user = user;
        this.role = role;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Club getClub() { return club; }
    public void setClub(Club club) { this.club = club; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}

