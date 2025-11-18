package thareesha.campusTalk.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import thareesha.campusTalk.dto.NotificationDTO;
import thareesha.campusTalk.model.Notification;
import thareesha.campusTalk.model.User;
import thareesha.campusTalk.repository.NotificationRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /* ===========================================================
       📌 Unified method — Save + Send Real-time WS Push
       =========================================================== */
    public void notify(User user, String title, String message, String type, Long refId) {

        Notification n = Notification.builder()
                .user(user)
                .message(message)
                .type(type)
                .referenceId(refId)
                .createdAt(LocalDateTime.now())
                .read(false)
                .build();

        notificationRepository.save(n);

        NotificationDTO dto = new NotificationDTO(
                n.getId(),
                title,
                n.getMessage(),
                n.getType(),
                n.getReferenceId(),
                n.isRead(),
                n.getCreatedAt()
        );

        messagingTemplate.convertAndSend("/queue/notifications-" + user.getId(), dto);
    }

    /* ===========================================================
       📌 Fetch List
       =========================================================== */
    public List<Notification> getUserNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    /* ===========================================================
       📌 Unread Count
       =========================================================== */
    public long countUnread(User user) {
        return notificationRepository.countByUserAndReadFalse(user);
    }

    /* ===========================================================
       📌 Mark as Read
       =========================================================== */
    public void markAsRead(Long id, User user) {
        Notification n = notificationRepository.findById(id)
                .filter(notif -> notif.getUser().equals(user))
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        n.setRead(true);
        notificationRepository.save(n);
    }
}
