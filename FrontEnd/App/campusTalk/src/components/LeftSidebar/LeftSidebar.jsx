import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api";
import "./LeftSidebar.css";

/*
  LeftSidebar — CampusTalk
  ✅ Displays current user info (name, faculty, university)
  ✅ Shows user stats fetched from backend /api/users/{id}/stats
  ✅ Provides quick links: My Network, Clubs, Events, Jobs
*/

export default function LeftSidebar() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0 });

  useEffect(() => {
    if (user?.id) {
      api
        .get(`/users/${user.id}/stats`)
        .then((res) => setStats(res.data))
        .catch(() => {});
    }
  }, [user]);

  return (
    <aside className="left-sidebar">
      <div className="profile-summary">
        <div className="cover" />
        <img
          src={user?.profileImage || "/placeholder-avatar.png"}
          alt="avatar"
          className="avatar-lg"
        />
        <h3>{user?.username || "User"}</h3>
        <p className="muted">
          {user?.faculty || "Faculty of Computing"}
          <br />
          {user?.university?.name || ""}
        </p>
      </div>

      <div className="user-stats">
        <div>
          <span className="label">Posts</span>
          <span className="value">{stats.posts}</span>
        </div>
        <div>
          <span className="label">Followers</span>
          <span className="value">{stats.followers}</span>
        </div>
        <div>
          <span className="label">Following</span>
          <span className="value">{stats.following}</span>
        </div>
      </div>

      <nav className="quick-links">
        <a href="/network">My Network</a>
        <a href="/clubs">Clubs</a>
        <a href="/events">Events</a>
        <a href="/jobs">Jobs</a>
      </nav>
    </aside>
  );
}
