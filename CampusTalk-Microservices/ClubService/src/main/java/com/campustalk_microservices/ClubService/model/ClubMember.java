package com.campustalk_microservices.ClubService.model;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "club_members")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClubMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long clubId;
    private Long userId;
    private String role;
}