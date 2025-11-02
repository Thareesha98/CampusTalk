// src/components/EventCard.jsx
import React from "react";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import "./EventCard.css";

/*
  ✅ EventCard Component
  - Displays event details (title, date, time, location, attendees)
  - Supports optional actions (RSVP, Edit, Delete)
  - Reusable across student & chairman views
*/

export default function EventCard({
  event,
  onRSVP,
  onEdit,
  onDelete,
  isChairman = false,
  hasRSVPed = false,
}) {
  const eventDate = new Date(event.dateTime);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = eventDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="event-card">
      {/* Header */}
      <div className="event-card-header">
        <h3>{event.title}</h3>
        {isChairman && (
          <div className="event-actions">
            <button
              className="edit-btn"
              onClick={() => onEdit && onEdit(event)}
              title="Edit Event"
            >
              ✏️
            </button>
            <button
              className="delete-btn"
              onClick={() => onDelete && onDelete(event.id)}
              title="Delete Event"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      {/* Body */}
      <p className="event-desc">{event.description || "No description available."}</p>

      <div className="event-details">
        <div className="event-row">
          <Calendar size={16} />
          <span>{formattedDate}</span>
        </div>
        <div className="event-row">
          <Clock size={16} />
          <span>{formattedTime}</span>
        </div>
        <div className="event-row">
          <MapPin size={16} />
          <span>{event.location || "TBA"}</span>
        </div>
        {event.rsvps && (
          <div className="event-row">
            <Users size={16} />
            <span>{event.rsvps.length} attending</span>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="event-card-footer">
        {!isChairman && (
          <button
            className={`btn-rsvp ${hasRSVPed ? "joined" : ""}`}
            onClick={() => onRSVP && onRSVP(event.id)}
          >
            {hasRSVPed ? "✓ RSVP’d" : "RSVP"}
          </button>
        )}

        {event.club && (
          <div className="event-club">
            <img
              src={event.club.profilePicUrl || "/club-placeholder.png"}
              alt={event.club.name}
            />
            <span>{event.club.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}
