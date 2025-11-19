// src/pages/Notifications.jsx
import React, { useContext, useEffect, useState } from "react";
import api from "../api";
import "./Notifications.css";
import { AuthContext } from "../context/AuthContext";

export default function Notifications() {
  const { loadingAuth } = useContext(AuthContext);

  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================================
  // LOAD NOTIFICATIONS
  // ==========================================================
  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/notifications"); 
      setNotifs(res.data || []);
    } catch (e) {
      console.error("Failed to load notifications:", e);
      setNotifs([]);
    }
    setLoading(false);
  };

  // ==========================================================
  // RUN ONLY AFTER TOKEN IS READY (Fix)
  // ==========================================================
  useEffect(() => {
    if (!loadingAuth) {
      loadNotifications();
    }
  }, [loadingAuth]);

  // ==========================================================
  // REAL-TIME WS REFRESH
  // ==========================================================
  useEffect(() => {
    const handler = () => loadNotifications();
    window.addEventListener("new-notification", handler);

    return () => window.removeEventListener("new-notification", handler);
  }, []);

  // ==========================================================
  // MARK READ
  // ==========================================================
  const markRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/read`);
      setNotifs((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (e) {
      console.error("Error marking notification read:", e);
    }
  };

  if (loadingAuth || loading)
    return <div className="center">Loading...</div>;

  return (
    <div className="notifications-page">
      <h2>Notifications</h2>

      {notifs.length === 0 ? (
        <p className="muted">No notifications yet</p>
      ) : (
        <div className="notif-list">
          {notifs.map((n) => (
            <div key={n.id}
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
