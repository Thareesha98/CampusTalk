import React, { useEffect, useState } from "react";
import api from "../api";
import "./Notifications.css";

export default function Notifications() {
  const [notifs, setNotifs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadPage = async (p) => {
    setLoading(true);
    try {
      const res = await api.get(`/notifications?page=${p}&size=10`);

      const content = res.data.content || res.data || [];
      setNotifs(content);

      setTotalPages(res.data.totalPages || 1);
      setPage(p);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => {
    loadPage(0);

    const refresh = () => loadPage(0);
    window.addEventListener("new-notification", refresh);

    return () => window.removeEventListener("new-notification", refresh);
  }, []);

  const markRead = async (id) => {
    await api.post(`/notifications/${id}/read`);
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
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
            <div key={n.id} className={`notif-item ${n.read ? "read" : ""}`}>
              <div className="notif-body">
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

      <div className="pagination">
        <button disabled={page === 0} onClick={() => loadPage(page - 1)}>
          ◀ Prev
        </button>
        <span>
          Page {page + 1} of {totalPages}
        </span>
        <button
          disabled={page + 1 >= totalPages}
          onClick={() => loadPage(page + 1)}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}
