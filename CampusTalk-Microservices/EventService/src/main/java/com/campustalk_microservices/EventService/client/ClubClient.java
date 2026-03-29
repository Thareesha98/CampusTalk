package com.campustalk_microservices.EventService.client;


import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class ClubClient {

    private final WebClient webClient = WebClient.create("http://club-service");

    public Object getClub(Long id) {
        return webClient.get()
                .uri("/api/clubs/" + id)
                .retrieve()
                .bodyToMono(Object.class)
                .block();
    }
}