package thareesha.campusTalk.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import jakarta.transaction.Transactional;
import thareesha.campusTalk.model.VerificationCode;

public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {
	Optional<VerificationCode> findByEmail(String email);
	 @Transactional
	void deleteByEmail(String email);
}
