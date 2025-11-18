package thareesha.campusTalk.service;

import org.springframework.stereotype.Service;
import thareesha.campusTalk.model.Club;
import thareesha.campusTalk.model.User;

import java.util.List;

@Service
public class FollowerService {

    public List<User> getFollowers(Club club) {
        if (club.getFollowers() == null) return List.of();
        return club.getFollowers().stream().toList();
    }
}
