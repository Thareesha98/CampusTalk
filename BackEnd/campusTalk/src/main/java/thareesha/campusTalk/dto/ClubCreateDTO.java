package thareesha.campusTalk.dto;

import lombok.Data;

/**
 * DTO for creating a new Club.
 * The Chairman and University will be auto-linked by backend.
 */
@Data
public class ClubCreateDTO {

    private String name;
    private String description;
    private String profilePicUrl; // optional: if set manually, else can upload later

    // 🏫 Only used if Admin creates a club for a specific university
    private Long universityId;
}
