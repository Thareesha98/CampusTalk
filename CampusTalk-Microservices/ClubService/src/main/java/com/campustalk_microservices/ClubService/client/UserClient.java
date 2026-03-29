package com.campustalk_microservices.ClubService.client;


import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class UserClient {

    private final WebClient webClient = WebClient.create("http://auth-user-service");

    public Long getUserIdByEmail(String email) {
        return webClient.get()
                .uri("/api/users/id-by-email?email=" + email)
                .retrieve()
                .bodyToMono(Long.class)
                .block();
    }
}