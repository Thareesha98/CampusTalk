package com.campustalk_microservices.ClubService.model;


import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity
@Table(name = "clubs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Club {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Long chairmanId;

    private Long universityId;

    @Column(name = "profile_pic_url")
    private String profilePicUrl;

    @ElementCollection
    private Set<Long> followerIds = new HashSet<>();
}