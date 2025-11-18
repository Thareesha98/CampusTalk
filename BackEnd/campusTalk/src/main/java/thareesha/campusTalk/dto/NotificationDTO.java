package thareesha.campusTalk.dto;

public class NotificationDTO {
    private String title;
    private String message;
    private Long userId;

    public NotificationDTO(String title, String message, Long userId) {
        this.title = title;
        this.message = message;
        this.userId = userId;
    }

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

    // getters and setters
    
}
