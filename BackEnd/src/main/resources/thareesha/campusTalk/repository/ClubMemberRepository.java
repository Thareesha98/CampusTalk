package thareesha.campusTalk.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import thareesha.campusTalk.model.ClubMember;

public interface ClubMemberRepository extends JpaRepository<ClubMember , Long> {
	List<ClubMember> findByClubId(Long clubId);
    List<ClubMember> findByUserId(Long userId);
}
