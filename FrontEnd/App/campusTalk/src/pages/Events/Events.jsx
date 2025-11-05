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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load events and (optionally) user's RSVPs; robustly handle both RSVP response shapes
  const loadEvents = async () => {
    try {
      const eventsRes = await api.get("/events", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const eventsData = eventsRes.data || [];

      // Build rsvpMap from /rsvps/my if possible
      const rsvpMap = {};
      if (token) {
        try {
          const rsvpRes = await api.get("/rsvps/my", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const rsvps = rsvpRes.data || [];

          // Accept both shapes:
          // { event: { id: 5 }, status: "INTERESTED" }
          // OR { eventId: 5, status: "INTERESTED" }
          rsvps.forEach((r) => {
            if (!r) return;
            // prefer nested event.id
            const nestedId = r.event?.id;
            const altId = r.eventId ?? r.event_id ?? r.event?.id;
            const eventId = nestedId ?? altId;
            const status = r.status ?? r.Status;
            if (eventId) {
              rsvpMap[eventId] = status ?? null;
            }
          });
        } catch (rErr) {
          const status = rErr?.response?.status;
          // treat auth/not-found as expected; log unexpected errors
          if (![401, 403, 404].includes(status)) {
            console.warn("Failed to fetch RSVPs (unexpected):", rErr);
          }
        }
      }

      const merged = eventsData.map((e) => ({
        ...e,
        rsvpStatus: rsvpMap[e.id] ?? null,
      }));

      setEvents(merged);
    } catch (err) {
      console.error("❌ Failed to load events:", err);
      setEvents([]);
    }
  };

  // Toggle RSVP (supports optimistic UI and toggling off)
  const handleRSVP = async (eventId, newStatus) => {
    try {
      setUpdating(eventId);

      // read current from state snapshot
      const current = events.find((ev) => ev.id === eventId);
      const currentStatus = current?.rsvpStatus;
      const isCancelling = currentStatus === newStatus;

      // optimistic update
      setEvents((prev) =>
        prev.map((e) => {
          if (e.id !== eventId) return e;
          return { ...e, rsvpStatus: isCancelling ? null : newStatus };
        })
      );

      if (!token) {
        throw new Error("Not authenticated");
      }

      if (isCancelling) {
        // delete RSVP — backend should support DELETE /api/rsvps/{eventId} or you can find id first.
        // Here we call the delete-by-event route you added: DELETE /api/rsvps/{eventId}
        // If your backend deletes by ID only, adjust accordingly (find RSVP id first)
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
      // revert by reloading fresh state from server
      try {
        await loadEvents();
      } catch (reloadErr) {
        console.error("❌ Reload after RSVP failure also failed:", reloadErr);
      }
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
