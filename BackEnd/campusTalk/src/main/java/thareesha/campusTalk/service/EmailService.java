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
            	    <div style="font-family: 'Poppins', Arial, sans-serif; padding: 0; margin: 0; background: #eef2f7;">
            	      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            	        
            	        <!-- Card -->
            	        <div style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 6px 25px rgba(0,0,0,0.15);">
            	          
            	          <!-- Header -->
            	          <div style="background: linear-gradient(135deg, #0ea5e9, #7dd3fc); padding: 25px; text-align: center;">
            	            <h2 style="color: #fff; margin: 0; font-weight: 700; font-size: 24px;">
            	              🔐 Password Reset Request
            	            </h2>
            	          </div>
            	          
            	          <!-- Content -->
            	          <div style="padding: 30px; color: #333; font-size: 16px; line-height: 1.6;">
            	            <p>Hello,</p>
            	            <p>You requested to reset your password. Use the token below:</p>

            	            <div style="
            	              background: #0ea5e9;
            	              color: #fff;
            	              padding: 14px 25px;
            	              text-align: center;
            	              display: inline-block;
            	              border-radius: 10px;
            	              font-size: 20px;
            	              letter-spacing: 3px;
            	              margin: 20px 0;
            	              font-weight: 700;">
            	              %s
            	            </div>

            	            <p>This token is valid for <strong>10 minutes</strong>.</p>
            	            <p>If you did not make this request, please ignore this email.</p>
            	          </div>

            	          <!-- Footer -->
            	          <div style="background: #f1f5f9; padding: 18px; text-align: center; color: #555; font-size: 14px;">
            	            <strong>Spiral Softwares</strong><br/>
            	            Owned by <strong>Mr. Thareesha Marasinghe</strong>
            	          </div>

            	        </div>
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
            	    <div style="font-family: 'Poppins', Arial, sans-serif; padding: 0; margin: 0; background: #eef2f7;">
            	      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">

            	        <!-- Card -->
            	        <div style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 6px 25px rgba(0,0,0,0.15);">

            	          <!-- Header -->
            	          <div style="background: linear-gradient(135deg, #10b981, #4ade80); padding: 25px; text-align: center;">
            	            <h2 style="color: #fff; margin: 0; font-weight: 700; font-size: 24px;">
            	              🔐 Email Verification
            	            </h2>
            	          </div>

            	          <!-- Body -->
            	          <div style="padding: 30px; color: #333; font-size: 16px; line-height: 1.6;">
            	            <p>Your One-Time Password (OTP) is:</p>

            	            <div style="
            	              background: #10b981;
            	              color: #fff;
            	              padding: 14px 25px;
            	              text-align: center;
            	              display: inline-block;
            	              border-radius: 10px;
            	              font-size: 22px;
            	              letter-spacing: 3px;
            	              margin: 20px 0;
            	              font-weight: 700;">
            	              %s
            	            </div>

            	            <p>This OTP is valid for <strong>10 minutes</strong>.</p>
            	            <p>Please do not share it with anyone.</p>
            	          </div>

            	          <!-- Footer -->
            	          <div style="background: #f1f5f9; padding: 18px; text-align: center; color: #555; font-size: 14px;">
            	            <strong>Spiral Softwares</strong><br/>
            	            Owned by <strong>Mr. Thareesha Marasinghe</strong>
            	          </div>

            	        </div>
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
