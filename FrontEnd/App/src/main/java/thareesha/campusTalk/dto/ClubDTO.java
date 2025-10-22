package thareesha.campusTalk.dto;

import lombok.Data;
import java.util.List;

@Data
public class ClubDTO {
    private Long id;
    private String name;
    private String description;
    private UserDTO chairman;
    private List<ClubMemberDTO> members;
}
