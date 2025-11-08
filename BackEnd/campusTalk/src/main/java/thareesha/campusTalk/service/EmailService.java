package thareesha.campusTalk.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendResetToken(String to, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("🔐 Password Reset Request");
        message.setText(
            "Hello,\n\n" +
            "You requested to reset your password. Use the following token to reset it:\n\n" +
            token +
            "\n\nIf you did not request this, please ignore this email.\n\n" +
            "Best regards,\nPortfolio Security Team"
        );
        mailSender.send(message);
    }
}