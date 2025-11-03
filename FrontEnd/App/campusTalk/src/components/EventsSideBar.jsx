// 📁 src/components/EventsSidebar.jsx
import React, { useEffect, useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import "./EventsSideBar.css";

export default function EventsSidebar() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserEvents();
    }
  }, [user]);

  const fetchUserEvents = async () => {
    try {
      // First, get clubs the student joined
      const clubRes = await api.get("/clubs/joined", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const joinedClubs = clubRes.data || [];
      const allEvents = [];

      // Fetch events for each club sequentially
      for (const club of joinedClubs) {
        const eventRes = await api.get(`/events/club/${club.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        allEvents.push(
          ...eventRes.data.map((ev) => ({
            ...ev,
            clubName: club.name,
          }))
        );
      }

      // Sort by date
      const sorted = allEvents.sort(
        (a, b) => new Date(a.dateTime) - new Date(b.dateTime)
      );

      setEvents(sorted);
    } catch (err) {
      console.error("❌ Failed to load events:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="events-sidebar">Loading events...</div>;

  return (
    <aside className="events-sidebar">
      <h3>📅 Upcoming Events</h3>

      {events.length === 0 ? (
        <p className="no-events">No upcoming events.</p>
      ) : (
        <ul className="events-list">
          {events.slice(0, 5).map((ev) => (
            <li key={ev.id} className="event-item">
              <div className="event-info">
                <strong>{ev.title}</strong>
                <span className="event-date">
                  {new Date(ev.dateTime).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                  {" • "}
                  {ev.clubName}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
