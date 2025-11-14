import React, { useEffect, useState, useContext } from "react";
import api from "../../api";
import { AuthContext } from "../../context/AuthContext";
import "./Events.css";

export default function Events() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [clubsMap, setClubsMap] = useState({});
  const [updating, setUpdating] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 📥 Load all events and merge RSVP + Club data
  const loadEvents = async () => {
    try {
      // 🟢 1. Fetch all events
      const eventsRes = await api.get("/events", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const eventsData = eventsRes.data || [];

      // 🟢 2. Fetch all clubs once
      const clubsRes = await api.get("/clubs");
      const clubData = clubsRes.data || [];
      const clubMap = {};
      clubData.forEach((c) => (clubMap[c.id] = c));
      setClubsMap(clubMap);

      // 🟢 3. Fetch RSVPs (for logged-in users)
      let rsvpMap = {};
      if (token) {
        try {
          const rsvpRes = await api.get("/rsvps/my", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const rsvps = rsvpRes.data || [];
          rsvps.forEach((r) => {
            const eventId = r.event?.id ?? r.eventId ?? r.event_id;
            if (eventId) rsvpMap[eventId] = r.status ?? r.Status;
          });
        } catch (err) {
          console.warn("⚠️ RSVP fetch failed:", err);
        }
      }

      // 🟢 4. Merge: attach club + RSVP status
      const enriched = eventsData.map((e) => {
        const club = e.club?.id ? clubMap[e.club.id] : clubMap[e.clubId];
        return {
          ...e,
          club: club
            ? {
                ...club,
                university: club.university || { name: "Unknown University" },
              }
            : { name: "Unknown Club", university: { name: "Unknown University" } },
          rsvpStatus: rsvpMap[e.id] ?? null,
        };
      });

      setEvents(enriched);
    } catch (err) {
      console.error("❌ Failed to load events:", err);
      setEvents([]);
    }
  };

  // ✅ RSVP toggle (Interest / Going)
  const handleRSVP = async (eventId, newStatus) => {
    try {
      setUpdating(eventId);
      const current = events.find((e) => e.id === eventId);
      const currentStatus = current?.rsvpStatus;
      const isCancelling = currentStatus === newStatus;

      // Optimistic UI update
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId
            ? { ...e, rsvpStatus: isCancelling ? null : newStatus }
            : e
        )
      );

      if (!token) throw new Error("Not authenticated");

      if (isCancelling) {
        await api.delete(`/rsvps/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post(
          `/rsvps/${eventId}/respond`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (err) {
      console.error("❌ RSVP failed:", err);
      await loadEvents(); // revert to actual server state
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
              {/* 🖼 Event Image */}
              <div className="event-banner">
                <img
                  src={e.imageUrl || "/event-placeholder.png"}
                  alt={e.title}
                />
                <div className="event-timeleft">{timeLeft(e.dateTime)}</div>
              </div>

              {/* 📄 Event Info */}
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

                {/* 🏛 Club + University Info */}
                {e.club && (
                  <div className="host-info">
                    <img
                      src={
                        e.club.profilePicUrl
                          ? e.club.profilePicUrl
                          : "/club-placeholder.png"
                      }
                      alt={e.club.name}
                    />
                    <div className="host-text">
                      <span className="host-club">{e.club.name}</span><br></br>
                      <span className="host-uni">
                        {e.club.university?.name || "Unknown University"}
                      </span>
                    </div>
                  </div>
                )}

                {/* 🎟 RSVP Buttons */}
                <div className="rsvp-actions">
                  <button
                    className={`btn-rsvp ${
                      e.rsvpStatus === "INTERESTED" ? "active interested" : ""
                    }`}
                    onClick={() => handleRSVP(e.id, "INTERESTED")}
                    disabled={updating === e.id}
                  >
                    {e.rsvpStatus === "INTERESTED" ? "⭐ Interested" : "☆ Interest"}
                  </button>

                  <button
                    className={`btn-rsvp ${
                      e.rsvpStatus === "GOING" ? "active going" : ""
                    }`}
                    onClick={() => handleRSVP(e.id, "GOING")}
                    disabled={updating === e.id}
                  >
                    {e.rsvpStatus === "GOING" ? "✅ Going" : "☑️ Going"}
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
