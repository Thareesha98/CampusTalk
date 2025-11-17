package thareesha.campusTalk.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import thareesha.campusTalk.model.University;
import thareesha.campusTalk.repository.UniversityRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/universities")
public class UniversityController {

    @Autowired
    private UniversityRepository universityRepository;

    @PostMapping
    public ResponseEntity<University> createUniversity(@RequestBody University university) {
        return ResponseEntity.ok(universityRepository.save(university));
    }

    @GetMapping
    public ResponseEntity<List<University>> getAllUniversities() {
        return ResponseEntity.ok(universityRepository.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getUniversity(@PathVariable Long id){
    	return ResponseEntity.of(universityRepository.findById(id));
    }
    
    @GetMapping("/{id}/details")
    public ResponseEntity<?> getUniversityDetails(@PathVariable Long id) {

        Optional<University> uni = universityRepository.fetchFullById(id);

        if (uni.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(uni.get());
    }

}
