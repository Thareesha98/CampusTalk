package thareesha.campusTalk.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import thareesha.campusTalk.model.University;
import thareesha.campusTalk.repository.UniversityRepository;

import java.util.List;

@Component
public class DataSeeder {

    @Autowired
    private UniversityRepository universityRepository;

    @PostConstruct
    public void seedData() {
        if (universityRepository.count() == 0) {
            List<University> universities = List.of(
                    new University(null, "University of Colombo", "Colombo", "Leading university in Sri Lanka", "https://example.com/colombo.png", null, null),
                    new University(null, "University of Ruhuna", "Matara", "Leading university in Sri Lanka", "https://example.com/colombo.png", null, null),
                    new University(null, "University of Moratuwa", "Moratuwa", "Top engineering university", "https://example.com/moratuwa.png", null, null),
                    new University(null, "University of Peradeniya", "Kandy", "Oldest and most scenic university", "https://example.com/peradeniya.png", null, null)
            );
            universityRepository.saveAll(universities);
            System.out.println("✅ Seeded sample universities");
        }
    }
}
