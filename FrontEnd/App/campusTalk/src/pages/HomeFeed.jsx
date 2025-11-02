// src/pages/HomeFeed.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api";
import PostCard from "../components/PostCard";
import EventCard from "../components/EventCard";
import "./HomeFeed.css";

export default function HomeFeed() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // ✅ Load feed when component mounts
  useEffect(() => {
    if (user) {
      loadFeed();
    }
  }, [user]);

  const loadFeed = async () => {
    try {
      setLoading(true);

      // 🔹 Fetch posts from followed clubs
      const postsRes = await api.get(`/posts/followed`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 🔹 Fetch trending events
      const eventsRes = await api.get(`/events/trending`);

      setPosts(postsRes.data.reverse());
      setEvents(eventsRes.data);
    } catch (err) {
      console.error("Failed to load feed:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Like a post
  const handleLike = async (postId) => {
    try {
      const res = await api.post(`/posts/${postId}/like`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Update local state
      setPosts(
        posts.map((p) =>
          p.id === postId ? { ...p, likes: res.data.likes } : p
        )
      );
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  // ✅ Add a comment
  const handleComment = async (postId, text) => {
    if (!text.trim()) return;
    try {
      const res = await api.post(
        `/posts/${postId}/comments`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Add the new comment to state
      setPosts(
        posts.map((p) =>
          p.id === postId
            ? { ...p, comments: [...p.comments, res.data] }
            : p
        )
      );
    } catch (err) {
      console.error("Comment failed:", err);
    }
  };

  if (loading) return <div className="feed-loading">Loading feed...</div>;

  return (
    <div className="home-feed">
      <div className="feed-main">
        <h2>🧠 Your Campus Feed</h2>
        {posts.length > 0 ? (
          posts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              onLike={handleLike}
              onComment={handleComment}
            />
          ))
        ) : (
          <p className="muted">No posts yet. Follow clubs to see updates!</p>
        )}
      </div>

      <aside className="feed-sidebar">
        <h3>🔥 Trending Events</h3>
        {events.length > 0 ? (
          events.map((e) => <EventCard key={e.id} event={e} />)
        ) : (
          <p className="muted">No trending events right now.</p>
        )}
      </aside>
    </div>
  );
}
