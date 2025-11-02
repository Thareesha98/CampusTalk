// src/components/RSVPManager.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import "./RSVPManager.css";

export default function RSVPManager({ clubId }) {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // 🔹 Load all club events
  useEffect(() => {
    api
      .get(`/events/club/${clubId}`)
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Failed to load events:", err));
  }, [clubId]);

  // 🔹 Fetch RSVPs for selected event
  const loadRsvps = async (eventId) => {
    setLoading(true);
    try {
      const res = await api.get(`/events/${eventId}/rsvps`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRsvps(res.data);
    } catch (err) {
      console.error("Failed to load RSVPs:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle attendance toggle
  const toggleAttendance = async (rsvpId, currentStatus) => {
    try {
      const res = await api.put(
        `/rsvps/${rsvpId}/attendance`,
        { attended: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRsvps(
        rsvps.map((r) =>
          r.id === rsvpId ? { ...r, attended: res.data.attended } : r
        )
      );
    } catch (err) {
      console.error("Failed to update attendance:", err);
      alert("❌ Could not update attendance.");
    }
  };

  // 🔹 Remove RSVP
  const removeRsvp = async (rsvpId) => {
    if (!window.confirm("Remove this RSVP?")) return;
    try {
      await api.delete(`/rsvps/${rsvpId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRsvps(rsvps.filter((r) => r.id !== rsvpId));
      alert("🗑 RSVP removed!");
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Export RSVPs as CSV
  const exportCsv = async (eventId) => {
    try {
      const res = await api.get(`/events/${eventId}/export-rsvps`, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `event_${eventId}_rsvps.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to export CSV:", err);
      alert("❌ Could not export RSVPs.");
    }
  };

  return (
    <div className="rsvp-manager">
      <h3>🎟 RSVP Manager</h3>

      {/* Select Event */}
      <div className="event-selector">
        <label>Select Event:</label>
        <select
          onChange={(e) => {
            const eventId = e.target.value;
            setSelectedEvent(eventId);
            if (eventId) loadRsvps(eventId);
          }}
        >
          <option value="">-- Choose an event --</option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.title}
            </option>
          ))}
        </select>

        {selectedEvent && (
          <button
            className="btn-export"
            onClick={() => exportCsv(selectedEvent)}
          >
            ⬇ Export CSV
          </button>
        )}
      </div>

      {/* RSVP Table */}
      {loading ? (
        <p>Loading RSVPs...</p>
      ) : rsvps.length === 0 ? (
        <p className="muted">No RSVPs found for this event.</p>
      ) : (
        <table className="rsvp-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Participant</th>
              <th>Email</th>
              <th>University</th>
              <th>Attended</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rsvps.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td>{r.user?.name}</td>
                <td>{r.user?.email}</td>
                <td>{r.user?.university?.name || "—"}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={r.attended}
                    onChange={() => toggleAttendance(r.id, r.attended)}
                  />
                </td>
                <td>
                  <button
                    className="btn-delete"
                    onClick={() => removeRsvp(r.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
