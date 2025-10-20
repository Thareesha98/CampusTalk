package thareesha.campusTalk.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;



@Service
public class S3Service {

    private final S3Client s3Client;

    @Value("${aws.s3.bucketName}")
    private String bucketName;

    public S3Service(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    /**
     * Upload file to AWS S3 with folder prefix
     * @param file the file to upload
     * @param folderPrefix optional folder name (e.g. "user-profile-pics/")
     * @return public URL of uploaded file
     */
    public String uploadFile(MultipartFile file, String folderPrefix) {
        String uniqueFileName = folderPrefix + UUID.randomUUID() + "_" + file.getOriginalFilename();

        try {
            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(uniqueFileName)
                            .contentType(file.getContentType())
                            .build(),
                    software.amazon.awssdk.core.sync.RequestBody.fromBytes(file.getBytes())
            );

            // Return the public file URL
            return "https://" + bucketName + ".s3.amazonaws.com/" + uniqueFileName;

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file to S3", e);
        }
    }

    /**
     * Overloaded version (default to root folder)
     */
    public String uploadFile(MultipartFile file) {
        return uploadFile(file, "");
    }
}
