import React, { useEffect, useState, useContext } from "react";
import api from "../../api";
import { AuthContext } from "../../context/AuthContext";
import "./Events.css";

/*
  Events Page — CampusTalk
  ✅ Fetches events from /api/events
  ✅ Displays event name, date, description, club/university
  ✅ Join/Unjoin event integration (/api/events/{id}/join)
  ✅ Shows live countdown timer
*/

export default function Events() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [joiningEvent, setJoiningEvent] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    api
      .get("/events")
      .then((res) => setEvents(res.data))
      .catch(() => setEvents([]));
  };

  const handleJoin = async (eventId) => {
    try {
      setJoiningEvent(eventId);
      await api.post(`/events/${eventId}/join`, { userId: user.id });
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId ? { ...e, joined: !e.joined } : e
        )
      );
    } catch (err) {
      console.error("Failed to join event:", err);
    } finally {
      setJoiningEvent(null);
    }
  };

  const timeLeft = (dateStr) => {
    const target = new Date(dateStr);
    const now = new Date();
    const diff = target - now;
    if (diff <= 0) return "Started";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    return `${days}d ${hours}h ${mins}m`;
  };

  return (
    <div className="events-page">
      <h2>Campus Events</h2>

      {events.length === 0 ? (
        <p className="muted">No events found.</p>
      ) : (
        <div className="events-grid">
          {events.map((e) => (
            <div key={e.id} className="event-card">
              <div className="event-banner">
                <img src={e.imageUrl || "/event-placeholder.png"} alt={e.title} />
                <div className="event-timeleft">{timeLeft(e.date)}</div>
              </div>

              <div className="event-info">
                <h3>{e.title}</h3>
                <p className="muted">
                  {new Date(e.date).toLocaleDateString()} •{" "}
                  {new Date(e.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                <p className="desc">
                  {e.description?.length > 100
                    ? e.description.substring(0, 100) + "..."
                    : e.description || "No description."}
                </p>

                <div className="host-info">
                  {e.club ? (
                    <>
                      <img
                        src={e.club.imageUrl || "/club-placeholder.png"}
                        alt={e.club.name}
                      />
                      <span>{e.club.name}</span>
                    </>
                  ) : (
                    <span>{e.university?.name || "University Event"}</span>
                  )}
                </div>

                <button
                  className={`btn-join ${e.joined ? "joined" : ""}`}
                  onClick={() => handleJoin(e.id)}
                  disabled={joiningEvent === e.id}
                >
                  {joiningEvent === e.id
                    ? "Processing..."
                    : e.joined
                    ? "Joined"
                    : "Join"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
