package thareesha.campusTalk.model;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import thareesha.campusTalk.model.Event;


@Entity
@Table(name = "rsvp")
public class RSVP {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;


	@ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String status; // "going" or "interested"

    private LocalDateTime timestamp;
    
    
    
    
    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Event getEvent() {
		return event;
	}

	public void setEvent(Event event) {
		this.event = event;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public LocalDateTime getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(LocalDateTime timestamp) {
		this.timestamp = timestamp;
	}
}
