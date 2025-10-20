package thareesha.campusTalk.controller;


import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import thareesha.campusTalk.service.S3Service;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin("*")
public class FileUploadController {

    private final S3Service s3Service;

    public FileUploadController(S3Service s3Service) {
        this.s3Service = s3Service;
    }

    // ✅ General upload (default folder)
    @PostMapping("/image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        String imageUrl = s3Service.uploadFile(file);
        return ResponseEntity.ok(imageUrl);
    }

    // ✅ Upload user profile pictures
    @PostMapping("/user-profile")
    public ResponseEntity<String> uploadUserProfile(@RequestParam("file") MultipartFile file) {
        String imageUrl = s3Service.uploadFile(file, "user-profile-pics/");
        return ResponseEntity.ok(imageUrl);
    }

    // ✅ Upload club profile pictures
    @PostMapping("/club-profile")
    public ResponseEntity<String> uploadClubProfile(@RequestParam("file") MultipartFile file) {
        String imageUrl = s3Service.uploadFile(file, "club-profile-pics/");
        return ResponseEntity.ok(imageUrl);
    }

    // ✅ Test endpoint (unchanged)
    @PostMapping("/test")
    public ResponseEntity<?> testUpload(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(Map.of(
            "name", file.getOriginalFilename(),
            "size", file.getSize(),
            "type", file.getContentType()
        ));
    }
}

