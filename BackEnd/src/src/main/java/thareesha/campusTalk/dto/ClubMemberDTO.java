package thareesha.campusTalk.dto;

import lombok.Data;

@Data
public class ClubMemberDTO {
    private Long id;
    private UserDTO user;
    private String role;
}
