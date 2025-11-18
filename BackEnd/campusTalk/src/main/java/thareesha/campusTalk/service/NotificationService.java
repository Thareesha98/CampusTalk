package thareesha.campusTalk.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import thareesha.campusTalk.dto.NotificationDTO;
import thareesha.campusTalk.model.Notification;
import thareesha.campusTalk.model.User;
import thareesha.campusTalk.repository.NotificationRepository;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;  // 🔥 WebSocket sender


    /* ===========================================================
       📌 1. SAVE NOTIFICATION IN DATABASE (your original logic)
       =========================================================== */
    public void sendNotification(User user, String message, String type, Long refId) {
        Notification n = Notification.builder()
                .user(user)
                .message(message)
                .type(type)
                .referenceId(refId)
                .build();
        notificationRepository.save(n);
    }

    public List<Notification> getUserNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public long countUnread(User user) {
        return notificationRepository.countByUserAndReadFalse(user);
    }

    public void markAsRead(Long id, User user) {
        Notification n = notificationRepository.findById(id)
                .filter(notif -> notif.getUser().equals(user))
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        n.setRead(true);
        notificationRepository.save(n);
    }



    /* ===========================================================
       📌 2. REAL-TIME WEBSOCKET NOTIFICATIONS (NEW)
       =========================================================== */

    // 🔔 Send a real-time notification to a specific user
    public void sendToUser(Long userId, NotificationDTO dto) {
        messagingTemplate.convertAndSend("/queue/notifications-" + userId, dto);
    }

    // 🔔 Broadcast to admins or all clients
    public void broadcast(NotificationDTO dto) {
        messagingTemplate.convertAndSend("/topic/global", dto);
    }
}
