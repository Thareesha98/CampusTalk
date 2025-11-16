package thareesha.campusTalk.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // 🔐 Reset Token Email
    public void sendResetToken(String to, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject("🔐 Password Reset Request");

            String html = """
                <div style="font-family: 'Segoe UI', sans-serif; padding: 20px; background: #f4f6f8; color: #333;">
                  <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; padding: 30px;">
                    <h2 style="color: #007bff;">Password Reset Request</h2>
                    <p>Hello,</p>
                    <p>Your password reset token is:</p>
                    <div style="background: #007bff; color: white; padding: 10px 20px; display: inline-block; border-radius: 6px; font-size: 1.2rem; letter-spacing: 2px;">
                      <strong>%s</strong>
                    </div>
                    <p style="margin-top: 20px;">Valid for 10 minutes.</p>
                    <p>If this wasn’t you, ignore this message.</p>
                  </div>
                </div>
                """.formatted(token);

            helper.setText(html, true);
            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send reset email", e);
        }
    }

    // 🔐 OTP Email
    public void sendOtpEmail(String to, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject("🔐 Your OTP Code");

            String html = """
                <div style="font-family: 'Segoe UI', sans-serif; padding: 20px; background: #f9fafb; color: #333;">
                  <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 25px;">
                    <h2 style="color: #007bff;">Email Verification</h2>
                    <p>Your OTP is:</p>
                    <div style="background: #28a745; color: white; padding: 10px 20px; display: inline-block; border-radius: 6px; font-size: 1.2rem; letter-spacing: 2px;">
                      <strong>%s</strong>
                    </div>
                    <p>This code is valid for <strong>10 minutes</strong>.</p>
                  </div>
                </div>
                """.formatted(otp);

            helper.setText(html, true);
            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }
}
