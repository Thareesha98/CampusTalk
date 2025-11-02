// src/pages/Notifications/Notifications.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import "./Notifications.css";

/*
  /notifications page
  - Lists notifications, mark read/unread
  - Backend: GET /notifications, POST /notifications/{id}/read
*/

export default function Notifications() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/notifications").then((r) => {
      setNotifs(r.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const markRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/read`);
      setNotifs((prev) => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (e) {}
  };

  if (loading) return <div className="center">Loading...</div>;

  return (
    <div className="notifications-page">
      <h2>Notifications</h2>
      {notifs.length === 0 ? <p className="muted">No notifications</p> : (
        <div className="notif-list">
          {notifs.map(n => (
            <div key={n.id} className={`notif-item ${n.read ? "read" : ""}`}>
              <div className="notif-body">
                <p className="notif-text">{n.message}</p>
                <span className="muted">{new Date(n.createdAt).toLocaleString()}</span>
              </div>
              {!n.read && <button className="btn-outline-sm" onClick={() => markRead(n.id)}>Mark read</button>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
