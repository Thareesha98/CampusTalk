// src/pages/DashboardLayout.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ClubPostsManager from "../components/ClubPostsManager";
import ClubEventsManager from "../components/ClubEventsManager";
import RSVPManager from "../components/RSVPManager";
import ClubStats from "../components/ClubStats";
import api from "../api";
import "./DashboardLayout.css";

export default function DashboardLayout() {
  const { id } = useParams(); // clubId from route
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [club, setClub] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Prevent access for non-chairman/admin
    if (!["CHAIRMAN", "ADMIN"].includes(user.role)) {
      navigate("/");
      return;
    }

    loadClub();
  }, [user, id]);

  const loadClub = async () => {
    try {
      const res = await api.get(`/clubs/${id}`);
      setClub(res.data);
    } catch (err) {
      console.error("Failed to load club:", err);
    }
  };

  if (!club) {
    return (
      <div className="dashboard-layout">
        <p>Loading club dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <img
            src={club.profilePicUrl || "/club-placeholder.png"}
            alt="Club"
            className="club-avatar"
          />
          <h2>{club.name}</h2>
          <p className="muted">{club.university?.name}</p>
        </div>

        <nav className="sidebar-nav">
          <button
            className={activeTab === "posts" ? "active" : ""}
            onClick={() => setActiveTab("posts")}
          >
            📝 Manage Posts
          </button>
          <button
            className={activeTab === "events" ? "active" : ""}
            onClick={() => setActiveTab("events")}
          >
            📅 Manage Events
          </button>
          <button
            className={activeTab === "rsvps" ? "active" : ""}
            onClick={() => setActiveTab("rsvps")}
          >
            🎟 RSVP Manager
          </button>
          <button
            className={activeTab === "stats" ? "active" : ""}
            onClick={() => setActiveTab("stats")}
          >

            <Link to="/clubs/new" className="btn-primary">
            + Create New Club
            </Link>


            📊 Club Stats
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        {activeTab === "posts" && <ClubPostsManager clubId={club.id} />}
        {activeTab === "events" && <ClubEventsManager clubId={club.id} />}
        {activeTab === "rsvps" && <RSVPManager clubId={club.id} />}
        {activeTab === "stats" && <ClubStats clubId={club.id} />}
      </main>
    </div>
  );
}
