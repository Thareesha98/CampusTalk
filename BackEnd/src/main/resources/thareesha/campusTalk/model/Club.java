package thareesha.campusTalk.model;


import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "clubs")
public class Club {

   

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Chairman of the club (User who manages it)
    @ManyToOne
    @JoinColumn(name = "chairman_id")
    @JsonIgnoreProperties({"followedClubs", "posts", "password"}) // avoid infinite loops

    private User chairman;

    // Relationships
    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL)
    private List<Event> events;

    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL)
    @JsonManagedReference 
    private List<ClubMember> members = new ArrayList<>();;
    
    @ManyToMany
    @JoinTable(
        name = "club_followers",
        joinColumns = @JoinColumn(name = "club_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> followers = new HashSet<>();
    
    @ManyToOne
    @JoinColumn(name = "university_id")
    private University university;

    
    @Column(name = "profile_pic_url")
    private String profilePicUrl;

    
    
    
    
    
    public String getProfilePicUrl() {
		return profilePicUrl;
	}

	public void setProfilePicUrl(String profilePicUrl) {
		this.profilePicUrl = profilePicUrl;
	}

	public University getUniversity() {
		return university;
	}

	public void setUniversity(University university) {
		this.university = university;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public User getChairman() {
		return chairman;
	}

	public void setChairman(User chairman) {
		this.chairman = chairman;
	}

	public List<Event> getEvents() {
		return events;
	}

	public void setEvents(List<Event> events) {
		this.events = events;
	}

	public List<ClubMember> getMembers() {
		return members;
	}

	public void setMembers(List<ClubMember> members) {
		this.members = members;
	}

	public Set<User> getFollowers() {
		return followers;
	}

	public void setFollowers(Set<User> followers) {
		this.followers = followers;
	}
     
}
