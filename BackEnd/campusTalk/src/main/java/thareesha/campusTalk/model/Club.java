package thareesha.campusTalk.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.*;

@Entity
@Table(name = "clubs")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Club {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    // 👤 Chairman of the club
    @ManyToOne
    @JoinColumn(name = "chairman_id")
    @JsonIgnoreProperties({
        "followedClubs", "posts", "university", "password"
    })
    private User chairman;

    // 📅 Club events
    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("club") // prevent Event → Club → Event loop
    private List<Event> events = new ArrayList<>();

    // 👥 Club members
    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL)
    @JsonManagedReference // links to ClubMember.club
    private List<ClubMember> members = new ArrayList<>();

    // ❤️ Followers
    @ManyToMany
    @JoinTable(
        name = "club_followers",
        joinColumns = @JoinColumn(name = "club_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @JsonIgnoreProperties({
        "followedClubs", "posts", "university", "password"
    })
    private Set<User> followers = new HashSet<>();

    // 🏫 University
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "university_id")
    @JsonIgnoreProperties({"clubs", "students"}) // avoid infinite club ↔ university recursion
    private University university;

    @Column(name = "profile_pic_url")
    private String profilePicUrl;

    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public User getChairman() { return chairman; }
    public void setChairman(User chairman) { this.chairman = chairman; }

    public List<Event> getEvents() { return events; }
    public void setEvents(List<Event> events) { this.events = events; }

    public List<ClubMember> getMembers() { return members; }
    public void setMembers(List<ClubMember> members) { this.members = members; }

    public Set<User> getFollowers() { return followers; }
    public void setFollowers(Set<User> followers) { this.followers = followers; }

    public University getUniversity() { return university; }
    public void setUniversity(University university) { this.university = university; }

    public String getProfilePicUrl() { return profilePicUrl; }
    public void setProfilePicUrl(String profilePicUrl) { this.profilePicUrl = profilePicUrl; }
}
