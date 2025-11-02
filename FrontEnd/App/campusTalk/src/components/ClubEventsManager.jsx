// src/components/ClubEventsManager.jsx
import React, { useState, useEffect } from "react";
import api from "../api";
import "./ClubEventsManager.css";

export default function ClubEventsManager({ clubId }) {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    dateTime: "",
  });
  const token = localStorage.getItem("token");

  // 🔹 Load events
  useEffect(() => {
    loadEvents();
  }, [clubId]);

  const loadEvents = async () => {
    try {
      const res = await api.get(`/events/club/${clubId}`);
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to load events:", err);
    }
  };

  // 🔹 Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Create or Update Event
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.dateTime) {
      alert("Please fill out title and date/time.");
      return;
    }

    try {
      if (editingEvent) {
        // ✏ Update existing event
        const res = await api.put(`/events/${editingEvent.id}`, {
          ...formData,
          club: { id: clubId },
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEvents(events.map((e) => (e.id === editingEvent.id ? res.data : e)));
        alert("✅ Event updated!");
      } else {
        // 🆕 Create new event
        const res = await api.post("/events", {
          ...formData,
          club: { id: clubId },
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEvents([...events, res.data]);
        alert("🎉 Event created!");
      }

      // Reset form
      setFormData({ title: "", description: "", location: "", dateTime: "" });
      setEditingEvent(null);
    } catch (err) {
      console.error("Failed to save event:", err);
      alert("❌ Failed to save event");
    }
  };

  // 🔹 Delete Event
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await api.delete(`/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter((e) => e.id !== id));
      alert("🗑 Event deleted!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete event");
    }
  };

  // 🔹 Edit Event
  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      location: event.location,
      dateTime: event.dateTime?.slice(0, 16) || "",
    });
  };

  return (
    <div className="club-events-manager">
      <h3>Manage Club Events</h3>

      {/* Event Form */}
      <form className="event-form" onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Event title"
          value={formData.title}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Event description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
        />
        <input
          type="datetime-local"
          name="dateTime"
          value={formData.dateTime}
          onChange={handleChange}
        />

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {editingEvent ? "Update Event" : "Create Event"}
          </button>
          {editingEvent && (
            <button
              type="button"
              className="btn-cancel"
              onClick={() => {
                setEditingEvent(null);
                setFormData({
                  title: "",
                  description: "",
                  location: "",
                  dateTime: "",
                });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Event List */}
      <div className="events-list">
        {events.length === 0 ? (
          <p>No events created yet.</p>
        ) : (
          events.map((e) => (
            <div key={e.id} className="event-card">
              <div className="event-info">
                <h4>{e.title}</h4>
                <p>{e.description}</p>
                <p>
                  📍 <strong>{e.location}</strong>
                </p>
                <p>
                  🕓{" "}
                  {new Date(e.dateTime).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                <p>👥 RSVPs: {e.rsvps?.length || 0}</p>
              </div>
              <div className="event-actions">
                <button onClick={() => handleEdit(e)}>Edit</button>
                <button onClick={() => handleDelete(e.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
