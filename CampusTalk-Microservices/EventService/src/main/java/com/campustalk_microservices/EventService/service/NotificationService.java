package com.campustalk_microservices.EventService.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.campustalk_microservices.EventService.client.NotificationClient;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationClient client;

    public void send(String token, Long userId, String title, String msg, String type, Long ref) {
        client.send(token, userId, title, msg, type, ref);
    }
}