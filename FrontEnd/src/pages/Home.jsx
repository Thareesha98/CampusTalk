import React, { useState, useEffect, useContext, useRef } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import EventsSideBar from "../components/EventsSideBar";
import "./Home.css";

export default function Home() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // 🔁 Fetch posts of clubs student follows
  useEffect(() => {
    if (user) fetchFeed();
  }, [user]);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const res = await api.get("/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data.reverse());
    } catch (err) {
      console.error("❌ Failed to load posts:", err);
    } finally {
      setLoading(false);
    }
  };

  // ❤️ Like post
  const handleLike = async (postId) => {
    try {
      const res = await api.post(`/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, likes: res.data.likes } : p
        )
      );
    } catch (err) {
      console.error("❌ Failed to like post:", err);
    }
  };

  // 💬 Add comment
  const handleComment = async (postId, text) => {
    if (!text.trim()) return;
    try {
      const res = await api.post(
        `/posts/${postId}/comment`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, comments: [...p.comments, res.data] } : p
        )
      );
    } catch (err) {
      console.error("❌ Failed to comment:", err);
    }
  };

  return (
    <div className="home-layout">
      <section className="feed">
        <h2>🎓 Campus Feed</h2>
        {loading ? (
          <p>Loading feed...</p>
        ) : posts.length === 0 ? (
          <p>No posts yet. Join a club to see updates!</p>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={() => handleLike(post.id)}
              onComment={handleComment}
            />
          ))
        )}
      </section>

      <aside className="right-sidebar">
        <EventsSideBar />
      </aside>
    </div>
  );
}
