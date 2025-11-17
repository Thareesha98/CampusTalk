package thareesha.campusTalk.dto;

public class UniversityListDTO {
    private Long id;
    private String name;
    private String city;
    private String imageUrl;
    private int clubCount;
    private int studentCount;

    public UniversityListDTO(Long id, String name, String city, String imageUrl,
                             int clubCount, int studentCount) {
        this.id = id;
        this.name = name;
        this.city = city;
        this.imageUrl = imageUrl;
        this.clubCount = clubCount;
        this.studentCount = studentCount;
    }

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getCity() { return city; }
    public String getImageUrl() { return imageUrl; }
    public int getClubCount() { return clubCount; }
    public int getStudentCount() { return studentCount; }
}
