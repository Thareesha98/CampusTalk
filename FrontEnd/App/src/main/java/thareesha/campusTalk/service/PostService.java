package thareesha.campusTalk.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import thareesha.campusTalk.model.Post;
import thareesha.campusTalk.repository.PostRepository;

public class PostService {

	@Autowired
	private PostRepository postRepository;
	
	public Page<Post> getAllPosts(int page, int size ,String sortBy ){
		Pageable pageable = PageRequest.of(page, size , Sort.by(sortBy).ascending());
		return postRepository.findAll(pageable);
	}
}
