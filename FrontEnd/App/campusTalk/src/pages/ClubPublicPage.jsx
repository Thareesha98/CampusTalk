// src/pages/ClubPublicPage.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api";
import PostCard from "../components/PostCard";
import EventCard from "../components/EventCard";
import "./ClubPublicPage.css";

export default function ClubPublicPage() {
  const { id } = useParams(); // club ID
  const { user } = useContext(AuthContext);

  const [club, setClub] = useState(null);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    loadClubData();
  }, [id]);

  const loadClubData = async () => {
    try {
      const res = await api.get(`/clubs/${id}`);
      const clubData = res.data;
      setClub(clubData);
      setFollowersCount(clubData.followers?.length || 0);

      // Check if logged-in user follows the club
      if (user && clubData.followers?.some((f) => f.id === user.id)) {
        setIsFollowing(true);
      }

      const postsRes = await api.get(`/posts/club/${id}`);
      const eventsRes = await api.get(`/events/club/${id}`);
      setPosts(postsRes.data.reverse());
      setEvents(eventsRes.data.reverse());
    } catch (err) {
      console.error("Failed to load club:", err);
    }
  };

  const handleFollowToggle = async () => {
    if (!user) {
      alert("Please log in to follow clubs.");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      if (isFollowing) {
        await api.post(`/clubs/${id}/unfollow`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFollowing(false);
        setFollowersCount((prev) => prev - 1);
      } else {
        await api.post(`/clubs/${id}/follow`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFollowing(true);
        setFollowersCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Follow/unfollow failed:", err);
    }
  };

  if (!club)
    return (
      <div className="club-page center">
        <p>Loading club details...</p>
      </div>
    );

  return (
    <div className="club-page">
      {/* Hero Section */}
      <div className="club-banner">
        <div className="club-header">
          <img
            src={club.profilePicUrl || "/club-placeholder.png"}
            alt={club.name}
            className="club-avatar-lg"
          />
          <div className="club-info">
            <h1>{club.name}</h1>
            <p className="muted">{club.university?.name}</p>
            <p className="bio">{club.description || "No description yet."}</p>
            <div className="follow-section">
              <button
                className={`btn-follow ${isFollowing ? "following" : ""}`}
                onClick={handleFollowToggle}
              >
                {isFollowing ? "❤️ Following" : "🤍 Follow"}
              </button>
              <span>{followersCount} followers</span>
            </div>
          </div>
        </div>

        <div className="chairman-box">
          <h4>👤 Chairman</h4>
          <p>{club.chairman?.name || "Not assigned"}</p>
          <p className="muted">{club.chairman?.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="club-tabs">
        <section className="posts-section">
          <h3>📢 Club Posts</h3>
          {posts.length > 0 ? (
            posts.map((p) => <PostCard key={p.id} post={p} />)
          ) : (
            <p className="muted">No posts yet.</p>
          )}
        </section>

        <section className="events-section">
          <h3>📅 Upcoming Events</h3>
          {events.length > 0 ? (
            events.map((e) => <EventCard key={e.id} event={e} />)
          ) : (
            <p className="muted">No events available.</p>
          )}
        </section>

        <section className="members-section">
          <h3>👥 Club Members</h3>
          {club.members && club.members.length > 0 ? (
            <div className="member-grid">
              {club.members.map((m) => (
                <div key={m.id} className="member-card">
                  <img
                    src={m.user?.profilePicUrl || "/placeholder-avatar.png"}
                    alt={m.user?.name}
                  />
                  <p>{m.user?.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">No members yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}
