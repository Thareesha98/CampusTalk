import React, { useEffect, useState, useContext } from "react";
import api from "../../api";
import { AuthContext } from "../../context/AuthContext";
import "./RightSidebar.css";

/*
  RightSidebar — CampusTalk
  ✅ Shows upcoming events (/api/events?limit=3)
  ✅ Displays suggested clubs (/api/clubs/suggested)
  ✅ Join/Leave club integration (POST /api/clubs/{id}/join)
  ✅ Live event countdowns
*/

export default function RightSidebar() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [joiningClub, setJoiningClub] = useState(null);

  useEffect(() => {
    api
      .get("/events?limit=3")
      .then((res) => setEvents(res.data))
      .catch(() => setEvents([]));

    api
      .get("/clubs/suggested")
      .then((res) => setClubs(res.data))
      .catch(() => setClubs([]));
  }, []);

  const handleJoin = async (clubId) => {
    try {
      setJoiningClub(clubId);
      await api.post(`/clubs/${clubId}/join`, { userId: user.id });
      setClubs((prev) =>
        prev.map((c) =>
          c.id === clubId ? { ...c, joined: !c.joined } : c
        )
      );
    } catch (err) {
      console.error("Failed to join:", err);
    } finally {
      setJoiningClub(null);
    }
  };

  const timeLeft = (dateString) => {
    const eventDate = new Date(dateString);
    const diff = eventDate - new Date();
    if (diff <= 0) return "Started";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <aside className="right-sidebar">
      {/* Events Section */}
      <section className="event-section">
        <h3>Upcoming Events</h3>
        {events.length === 0 && <p className="muted">No upcoming events</p>}
        {events.map((e) => (
          <div key={e.id} className="event-card">
            <div className="event-details">
              <h4>{e.title}</h4>
              <p className="muted">
                {new Date(e.date).toLocaleDateString()} • {timeLeft(e.date)}
              </p>
            </div>
            <button className="btn-outline-sm">View</button>
          </div>
        ))}
      </section>

      {/* Clubs Section */}
      <section className="club-section">
        <h3>Suggested Clubs</h3>
        {clubs.length === 0 && <p className="muted">No suggestions</p>}
        {clubs.map((club) => (
          <div key={club.id} className="club-card-sm">
            <div className="club-info">
              <img
                src={club.imageUrl || "/club-placeholder.png"}
                alt={club.name}
              />
              <div>
                <h4>{club.name}</h4>
                <p className="muted">{club.university?.name}</p>
              </div>
            </div>
            <button
              className={`btn-join ${club.joined ? "joined" : ""}`}
              onClick={() => handleJoin(club.id)}
              disabled={joiningClub === club.id}
            >
              {joiningClub === club.id
                ? "Joining..."
                : club.joined
                ? "Joined"
                : "Join"}
            </button>
          </div>
        ))}
      </section>
    </aside>
  );
}
