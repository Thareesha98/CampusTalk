import React, { useEffect, useState } from "react";
import api from "../api";
import "./Notifications.css";

export default function Notifications() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/notifications");
      setNotifs(res.data || []);
    } catch (e) {
      setNotifs([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();

    const refresh = () => loadNotifications();
    window.addEventListener("new-notification", refresh);

    return () => window.removeEventListener("new-notification", refresh);
  }, []);

  const markRead = async (id) => {
    await api.post(`/notifications/${id}/read`);
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  if (loading) return <div className="center">Loading...</div>;

  return (
    <div className="notifications-page">
      <h2>Notifications</h2>

      {notifs.length === 0 ? (
        <p className="muted">No notifications yet</p>
      ) : (
        <div className="notif-list">
          {notifs.map((n) => (
            <div
              key={n.id}
              className={`notif-item ${n.read ? "read" : "unread"}`}
            >
              <div className="notif-body">
                <p className="notif-title">{n.type}</p>
                <p className="notif-text">{n.message}</p>

                <span className="time">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>

              {!n.read && (
                <button className="btn-mark" onClick={() => markRead(n.id)}>
                  Mark as read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
