package thareesha.campusTalk.dto;

import lombok.Data;

@Data
public class RSVPRequestDTO {
    private Long eventId;  // The event user RSVP’d for
    private String status; // e.g. "GOING", "INTERESTED", "NOT_GOING"
}
