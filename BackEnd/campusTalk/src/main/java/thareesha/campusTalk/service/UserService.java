package thareesha.campusTalk.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import thareesha.campusTalk.model.User;
import thareesha.campusTalk.repository.UserRepository;

@Service
public class UserService {
	@Autowired
	private UserRepository userRepository;
	
	public List<User> getAllUsers(){
		return userRepository.findAll();
	}
	
	public Optional<User> getUserById(Long id){
		return userRepository.findById(id);
	}
	
	public User saveUser(User user) {
		return userRepository.save(user);
	}
	
	 public User updateUser(Long id, User updatedUser) {
	        return userRepository.findById(id).map(user -> {
	            user.setName(updatedUser.getName());
	            user.setEmail(updatedUser.getEmail());
	            user.setRole(updatedUser.getRole());
	            return userRepository.save(user);
	        }).orElseThrow(() -> new RuntimeException("User not found"));
	 }
	 
	 public void deleteUser(Long id) {
	        userRepository.deleteById(id);
	    }
}
