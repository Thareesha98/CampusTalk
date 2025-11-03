import React, { useState, useEffect, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import "./RSVPManager.css";

export default function RSVPManager() {
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [rsvps, setRsvps] = useState([]);
  const token = localStorage.getItem("token");
  const { user } = useContext(AuthContext);

  // Load clubs
  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const res = await api.get("/clubs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClubs(res.data);
    } catch (err) {
      console.error("❌ Failed to load clubs:", err);
    }
  };

  // Load events for selected club
  useEffect(() => {
    if (selectedClub) fetchEvents(selectedClub);
  }, [selectedClub]);

  const fetchEvents = async (clubId) => {
    try {
      const res = await api.get(`/events/club/${clubId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
    } catch (err) {
      console.error("❌ Failed to load events:", err);
    }
  };

  // Load RSVPs for selected event
  useEffect(() => {
    if (selectedEvent) fetchRSVPs(selectedEvent);
  }, [selectedEvent]);

  const fetchRSVPs = async (eventId) => {
    try {
      const res = await api.get(`/rsvps/event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRsvps(res.data);
    } catch (err) {
      console.error("❌ Failed to load RSVPs:", err);
    }
  };

  // User marks RSVP
  const handleRSVP = async (status) => {
    if (!selectedEvent) return alert("Select an event first!");
    try {
      const res = await api.post(
        "/rsvps",
        { eventId: selectedEvent, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`✅ You marked as "${status}"`);
      fetchRSVPs(selectedEvent);
    } catch (err) {
      console.error("❌ Failed to RSVP:", err);
      alert("Failed to save RSVP.");
    }
  };

  // Delete RSVP (admin)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this RSVP?")) return;
    try {
      await api.delete(`/rsvps/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🗑 RSVP deleted");
      fetchRSVPs(selectedEvent);
    } catch (err) {
      console.error("❌ Failed to delete RSVP:", err);
    }
  };

  return (
    <div className="rsvp-manager">
      <h2 className="manager-title">RSVP Manager</h2>

      {/* Club selection */}
      <div className="selectors">
        <select
          value={selectedClub}
          onChange={(e) => setSelectedClub(e.target.value)}
        >
          <option value="">Select Club</option>
          {clubs.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          disabled={!selectedClub}
        >
          <option value="">Select Event</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title}
            </option>
          ))}
        </select>
      </div>

      {/* RSVP buttons for users */}
      <div className="rsvp-actions">
        <button onClick={() => handleRSVP("GOING")}>✅ Going</button>
        <button onClick={() => handleRSVP("INTERESTED")}>⭐ Interested</button>
        <button onClick={() => handleRSVP("NOT_GOING")}>❌ Not Going</button>
      </div>

      {/* RSVP list */}
      <div className="rsvp-list">
        {rsvps.length === 0 ? (
          <p>No RSVPs for this event yet.</p>
        ) : (
          rsvps.map((r) => (
            <div className="rsvp-card" key={r.id}>
              <p>
                <strong>{r.user?.name}</strong> — {r.status}
              </p>
              {user?.role === "ADMIN" && (
                <button onClick={() => handleDelete(r.id)}>🗑 Delete</button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
