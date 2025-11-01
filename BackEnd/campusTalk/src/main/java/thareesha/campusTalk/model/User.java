package thareesha.campusTalk.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
   // @JsonIgnore // never send password to frontend
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private String department;
    private String year;

    /**
     * Roles: "ADMIN", "CHAIRMAN", "STUDENT"
     * Note: Do NOT prefix with "ROLE_" — Spring adds it internally.
     */
    private String role;

    @Column(name = "profile_pic_url")
    private String profilePicUrl;

    // 🔁 User follows many clubs
    @ManyToMany(mappedBy = "followers")
    @JsonIgnore
    private Set<Club> followedClubs = new HashSet<>();

    // 📝 One user can have many posts
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("user") // avoid recursive serialization
    private List<Post> posts;

    // 🎓 Each user belongs to one university
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "university_id")
    @JsonIgnoreProperties({"students", "clubs"})
    private University university;


    // --- GETTERS & SETTERS ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getProfilePicUrl() { return profilePicUrl; }
    public void setProfilePicUrl(String profilePicUrl) { this.profilePicUrl = profilePicUrl; }

    public List<Post> getPosts() { return posts; }
    public void setPosts(List<Post> posts) { this.posts = posts; }

    public Set<Club> getFollowedClubs() { return followedClubs; }
    public void setFollowedClubs(Set<Club> followedClubs) { this.followedClubs = followedClubs; }

    public University getUniversity() { return university; }
    public void setUniversity(University university) { this.university = university; }
}
