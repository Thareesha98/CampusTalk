// src/components/NotificationBell/NotificationBell.jsx
import React, { useEffect, useState } from "react";
import api from "../../api";
import "./NotificationBell.css";

/*
  Lightweight bell component — used in Navbar
  - Fetches top notifications and mark-as-read
  - Clicking navigates to /notifications (Navbar may call navigate)
*/

export default function NotificationBell({ onOpen }) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    api
      .get("/notifications?limit=5")
      .then((res) => {
        if (!mounted) return;
        const list = res.data || [];
        setUnreadCount(list.filter((n) => !n.read).length);
      })
      .catch(() => {})
    return () => { mounted = false; };
  }, []);

  return (
    <button className="notif-bell" aria-label={`Notifications: ${unreadCount}`} onClick={onOpen}>
      <svg className="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C9.243 2 7 4.243 7 7v3.086A2 2 0 0 0 6 12v1l-1 1v1h14v-1l-1-1v-1a2 2 0 0 0-1-1.914V7c0-2.757-2.243-5-5-5z"></path></svg>
      {unreadCount > 0 && <span className="notif-count">{unreadCount}</span>}
    </button>
  );
}
