package thareesha.campusTalk.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import thareesha.campusTalk.model.University;
import thareesha.campusTalk.repository.UniversityRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

        Optional<University> uniOpt = universityRepository.fetchWithClubs(id);

        if (uniOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        University uni = uniOpt.get();

        int studentCount = (uni.getStudents() == null)
                ? 0
                : uni.getStudents().size();

        Map<String, Object> response = new HashMap<>();
        response.put("id", uni.getId());
        response.put("name", uni.getName());
        response.put("location", uni.getLocation());
        response.put("description", uni.getDescription());  // CAN BE NULL
        response.put("logoUrl", uni.getLogoUrl());          // CAN BE NULL
        response.put("imageUrl", uni.getImageUrl());        // CAN BE NULL
        response.put("studentCount", studentCount);
        response.put("clubs", uni.getClubs());               // SAFE

        return ResponseEntity.ok(response);
    }

}

