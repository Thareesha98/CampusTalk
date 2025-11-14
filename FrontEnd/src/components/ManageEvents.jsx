import React, { useEffect, useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import "./ManageEvents.css";

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);
  const token = localStorage.getItem("token");
  const { user } = useContext(AuthContext);

  // 🔁 Load clubs on mount
  useEffect(() => {
    fetchClubs();
  }, []);

  // 🔁 Load events when selected club changes
  useEffect(() => {
    if (selectedClub) fetchEventsByClub(selectedClub);
    else setEvents([]);
  }, [selectedClub]);

  // 🏛 Fetch clubs
  const fetchClubs = async () => {
    try {
      const res = await api.get("/clubs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      let clubList = res.data;
      if (user?.role === "CHAIRMAN") {
        clubList = clubList.filter((c) => c.chairman?.email === user.email);
      }
      setClubs(clubList);
      if (clubList.length === 1) setSelectedClub(clubList[0].id);
    } catch (err) {
      console.error("❌ Failed to load clubs:", err);
    }
  };

  // 📅 Fetch events by club
  const fetchEventsByClub = async (clubId) => {
    try {
      const res = await api.get(`/events/club/${clubId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
    } catch (err) {
      console.error("❌ Failed to load events:", err);
    }
  };

  // 🆕 Create or Update Event (supports image upload)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedClub) return alert("Please select a club!");
    if (!title.trim()) return alert("Please enter a title for the event.");

    const dto = { title, description, location, dateTime };

    const formData = new FormData();
    formData.append(
      "dto",
      new Blob([JSON.stringify(dto)], { type: "application/json" })
    );
    if (imageFile) formData.append("file", imageFile);

    try {
      let res;
      if (editingEvent) {
        res = await api.put(`/events/${editingEvent.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }, // ✅ let Axios set boundary
        });
        setEvents((prev) =>
          prev.map((e) => (e.id === editingEvent.id ? res.data : e))
        );
        alert("✅ Event updated successfully!");
      } else {
        res = await api.post(`/events/club/${selectedClub}`, formData, {
          headers: { Authorization: `Bearer ${token}` }, // ✅ let Axios set boundary
        });
        setEvents([res.data, ...events]);
        alert("✅ Event created successfully!");
      }

      resetForm();
    } catch (err) {
      console.error("❌ Failed to save event:", err);
      alert("Failed to save event. Check console for details.");
    }
  };

  // 🗑 Delete Event
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.delete(`/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents((prev) => prev.filter((e) => e.id !== id));
      alert("🗑 Event deleted!");
    } catch (err) {
      console.error("❌ Failed to delete event:", err);
      alert("Failed to delete event.");
    }
  };

  // ✏️ Edit Event
  const handleEdit = (event) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDescription(event.description);
    setLocation(event.location);
    setDateTime(event.dateTime ? event.dateTime.slice(0, 16) : "");
    setSelectedClub(event.club?.id || "");
    setImagePreview(event.imageUrl || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLocation("");
    setDateTime("");
    setImageFile(null);
    setImagePreview("");
    setEditingEvent(null);
  };

  return (
    <div className="manage-events">
      <h2 className="manager-title">
        {editingEvent ? "Edit Event" : "Manage Events"}
      </h2>

      {/* Event Form */}
      <form className="event-form" onSubmit={handleSubmit}>
        <select
          value={selectedClub}
          onChange={(e) => setSelectedClub(e.target.value)}
          required
        >
          <option value="">Select Club</option>
          {clubs.map((club) => (
            <option key={club.id} value={club.id}>
              {club.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Event Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <input
          type="text"
          placeholder="Event Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          required
        />

        {/* 🖼 Image Upload */}
        <div className="image-upload">
          <label>Event Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setImageFile(file);
              if (file) setImagePreview(URL.createObjectURL(file));
            }}
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {editingEvent ? "Update Event" : "Create Event"}
          </button>
          {editingEvent && (
            <button type="button" className="btn-cancel" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Events List */}
      <div className="events-list">
        {events.length === 0 ? (
          <p className="no-events">No events yet.</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="event-card">
              {event.imageUrl && (
                <img src={event.imageUrl} alt="Event" className="event-image" />
              )}
              <div className="event-header">
                <strong>{event.title}</strong>
                <span>
                  {new Date(event.dateTime).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>
              <p className="event-description">{event.description}</p>
              <p className="event-location">📍 {event.location}</p>
              <div className="event-footer">
                <span className="event-club">
                  🏛 {event.club?.name || "Unknown Club"}
                </span>
                <div className="event-actions">
                  <button onClick={() => handleEdit(event)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(event.id)}>🗑 Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
