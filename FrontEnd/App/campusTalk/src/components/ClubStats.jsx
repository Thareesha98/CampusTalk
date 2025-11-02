// src/components/ClubStats.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import "./ClubStats.css";

export default function ClubStats({ clubId }) {
  const [stats, setStats] = useState({
    members: 0,
    followers: 0,
    posts: 0,
    likes: 0,
    comments: 0,
    events: 0,
    rsvps: 0,
  });
  const [postEngagement, setPostEngagement] = useState([]);
  const [eventStats, setEventStats] = useState([]);
  const token = localStorage.getItem("token");

  // 🧩 Load stats data
  useEffect(() => {
    loadClubStats();
  }, [clubId]);

  const loadClubStats = async () => {
    try {
      const [clubRes, postsRes, eventsRes] = await Promise.all([
        api.get(`/clubs/${clubId}`),
        api.get(`/posts/club/${clubId}`),
        api.get(`/events/club/${clubId}`),
      ]);

      const club = clubRes.data;
      const posts = postsRes.data || [];
      const events = eventsRes.data || [];

      const totalLikes = posts.reduce((sum, p) => sum + (p.likes || 0), 0);
      const totalComments = posts.reduce(
        (sum, p) => sum + (p.comments?.length || 0),
        0
      );
      const totalRSVPs = events.reduce(
        (sum, e) => sum + (e.rsvps?.length || 0),
        0
      );

      // For chart data
      const engagementData = posts.map((p) => ({
        name: p.content?.substring(0, 20) + "...",
        likes: p.likes || 0,
        comments: p.comments?.length || 0,
      }));

      const eventData = events.map((e) => ({
        name: e.title?.substring(0, 20) + "...",
        RSVPs: e.rsvps?.length || 0,
      }));

      setStats({
        members: club.members?.length || 0,
        followers: club.followers?.length || 0,
        posts: posts.length,
        likes: totalLikes,
        comments: totalComments,
        events: events.length,
        rsvps: totalRSVPs,
      });

      setPostEngagement(engagementData);
      setEventStats(eventData);
    } catch (err) {
      console.error("Failed to load club stats:", err);
    }
  };

  return (
    <div className="club-stats">
      <h3>📊 Club Statistics</h3>

      {/* Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>👥 Members</h4>
          <p>{stats.members}</p>
        </div>
        <div className="stat-card">
          <h4>⭐ Followers</h4>
          <p>{stats.followers}</p>
        </div>
        <div className="stat-card">
          <h4>📝 Posts</h4>
          <p>{stats.posts}</p>
        </div>
        <div className="stat-card">
          <h4>❤️ Likes</h4>
          <p>{stats.likes}</p>
        </div>
        <div className="stat-card">
          <h4>💬 Comments</h4>
          <p>{stats.comments}</p>
        </div>
        <div className="stat-card">
          <h4>📅 Events</h4>
          <p>{stats.events}</p>
        </div>
        <div className="stat-card">
          <h4>🙌 RSVPs</h4>
          <p>{stats.rsvps}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="charts">
        <div className="chart-card">
          <h4>📈 Post Engagement (Likes vs Comments)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={postEngagement}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="likes" fill="#3b82f6" />
              <Bar dataKey="comments" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h4>📅 Event Participation (RSVPs)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={eventStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="RSVPs"
                stroke="#10b981"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
