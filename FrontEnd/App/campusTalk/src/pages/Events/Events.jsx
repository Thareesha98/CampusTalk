import React, { useEffect, useState, useContext } from "react";
import api from "../../api";
import { AuthContext } from "../../context/AuthContext";
import "./Events.css";

export default function Events() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [updating, setUpdating] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
  try {
    // 🟩 Always load events
    const res = await api.get("/events", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const eventsData = res.data;

    // 🟨 Try to load RSVP info, but if it fails, continue normally
    let rsvpMap = {};
    try {
      const rsvpRes = await api.get("/rsvp/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      rsvpRes.data.forEach((r) => (rsvpMap[r.event.id] = r.status));
    } catch (innerErr) {
      console.warn("⚠️ RSVP info not found (maybe /rsvp/my missing)");
    }

    const merged = eventsData.map((e) => ({
      ...e,
      rsvpStatus: rsvpMap[e.id] || null,
    }));

    setEvents(merged);
  } catch (err) {
    console.error("❌ Failed to load events:", err);
    setEvents([]);
  }
};


  const handleRSVP = async (eventId, status) => {
    try {
      setUpdating(eventId);
      await api.post(
        `/rsvp/${eventId}/respond`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId ? { ...e, rsvpStatus: status } : e
        )
      );
    } catch (err) {
      console.error("❌ RSVP failed:", err);
    } finally {
      setUpdating(null);
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
                <div className="event-timeleft">{timeLeft(e.dateTime)}</div>
              </div>

              <div className="event-info">
                <h3>{e.title}</h3>
                <p className="muted">
                  {new Date(e.dateTime).toLocaleDateString()} •{" "}
                  {new Date(e.dateTime).toLocaleTimeString([], {
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
                        src={e.club.profilePicUrl || "/club-placeholder.png"}
                        alt={e.club.name}
                      />
                      <span>{e.club.name}</span>
                    </>
                  ) : (
                    <span>{e.university?.name || "University Event"}</span>
                  )}
                </div>

                <div className="rsvp-actions">
                  <button
                    className={`btn-rsvp ${
                      e.rsvpStatus === "INTERESTED" ? "active interested" : ""
                    }`}
                    onClick={() => handleRSVP(e.id, "INTERESTED")}
                    disabled={updating === e.id}
                  >
                    ⭐ Interested
                  </button>

                  <button
                    className={`btn-rsvp ${
                      e.rsvpStatus === "GOING" ? "active going" : ""
                    }`}
                    onClick={() => handleRSVP(e.id, "GOING")}
                    disabled={updating === e.id}
                  >
                    ✅ Going
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
