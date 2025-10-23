package thareesha.campusTalk.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "universities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class University {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    private String location;

    private String description;

    private String logoUrl;

    // Relationships
    @OneToMany(mappedBy = "university", cascade = CascadeType.ALL)
    private List<User> students;

    @OneToMany(mappedBy = "university", cascade = CascadeType.ALL)
    private List<Club> clubs;
}
