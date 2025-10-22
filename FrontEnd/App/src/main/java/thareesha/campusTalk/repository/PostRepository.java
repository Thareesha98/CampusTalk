package thareesha.campusTalk.repository;


import thareesha.campusTalk.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
	List<Post> findByClub_Id(Long clubId);
    
}
