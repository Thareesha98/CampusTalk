package thareesha.campusTalk.dto;

import lombok.Data;

@Data
public class EventRequestDTO {
    private String title;
    private String description;
    private String location;
    private String dateTime; // keep as String; parse to LocalDateTime in controller
}
