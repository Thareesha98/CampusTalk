package thareesha.campusTalk.repository;


import thareesha.campusTalk.model.Club;
import thareesha.campusTalk.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Set;

public interface PostRepository extends JpaRepository<Post, Long> {
	List<Post> findByClub_Id(Long clubId);
    List<Post> findByClubIdInOrderByCreatedAtDesc(List<Long> clubIds);
    List<Post> findAllByOrderByCreatedAtDesc();
    List<Post> findByClubIdOrderByCreatedAtDesc(Long clubId);

    // 🔥 Find all posts from multiple clubs (for the student feed)
    List<Post> findByClubInOrderByCreatedAtDesc(Set<Club> clubs);

    // 📅 Find all posts by a specific user (profile page)
    List<Post> findByUserIdOrderByCreatedAtDesc(Long userId);
    
}
