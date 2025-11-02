package thareesha.campusTalk.dto;

public class UserUpdateRequest {
    private String bio;
    private String profilePicUrl;

    public String getBio() {
        return bio;
    }
    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getProfilePicUrl() {
        return profilePicUrl;
    }
    public void setProfilePicUrl(String profilePicUrl) {
        this.profilePicUrl = profilePicUrl;
    }
}
