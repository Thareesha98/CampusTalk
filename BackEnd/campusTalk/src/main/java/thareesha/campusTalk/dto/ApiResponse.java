package thareesha.campusTalk.dto;


import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
//dome
public class ApiResponse<T> {
    private String status;
    private String message;
    private T data;
    private LocalDateTime timestamp = LocalDateTime.now();

    public ApiResponse(String message, T data) {
        this.status = "success";
        this.message = message;
        this.data = data;
    }
}
