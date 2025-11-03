package thareesha.campusTalk.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import thareesha.campusTalk.model.University;
import thareesha.campusTalk.repository.UniversityRepository;

@Service
public class UniversityService {

    @Autowired
    private UniversityRepository universityRepository;

    public University findById(Long id) {
        return universityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("University not found with id: " + id));
    }
}
