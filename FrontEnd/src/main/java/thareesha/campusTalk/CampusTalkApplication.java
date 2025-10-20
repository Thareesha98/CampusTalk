package thareesha.campusTalk;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class CampusTalkApplication {

	public static void main(String[] args) {
		SpringApplication.run(CampusTalkApplication.class, args);
	}

}
