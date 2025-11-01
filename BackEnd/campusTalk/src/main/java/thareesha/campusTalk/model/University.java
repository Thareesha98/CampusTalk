package thareesha.campusTalk.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    @OneToMany(mappedBy = "university", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<User> students;

    @OneToMany(mappedBy = "university", cascade = CascadeType.ALL)
    private List<Club> clubs;
}

