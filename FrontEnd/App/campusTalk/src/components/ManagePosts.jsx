import React, { useEffect, useState, useRef, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import "./ManagePosts.css";

export default function ManagePosts() {
  const [posts, setPosts] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const fileRef = useRef();
  const token = localStorage.getItem("token");

  const { user } = useContext(AuthContext); // To filter clubs by role

  // 🔁 Load clubs once
  useEffect(() => {
    fetchClubs();
  }, []);

  // 🔁 Fetch posts when club changes
  useEffect(() => {
    if (selectedClub) {
      fetchClubPosts(selectedClub);
    } else {
      setPosts([]);
    }
  }, [selectedClub]);

  // 📦 Load clubs for dropdown
  const fetchClubs = async () => {
    try {
      const res = await api.get("/clubs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      let clubList = res.data;

      // 🧠 Filter clubs if chairman (show only their club)
      if (user?.role === "CHAIRMAN") {
        clubList = clubList.filter(
          (c) => c.chairman?.email === user.email
        );
      }

      setClubs(clubList);

      // Auto-select first club if only one
      if (clubList.length === 1) {
        setSelectedClub(clubList[0].id);
      }
    } catch (err) {
      console.error("❌ Failed to load clubs:", err);
    }
  };

  // 📜 Fetch posts for selected club
  const fetchClubPosts = async (clubId) => {
    try {
      const res = await api.get(`/posts/club/${clubId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err) {
      console.error(`❌ Failed to load posts for club ${clubId}:`, err);
    }
  };

  // 🆕 Create or Update post
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedClub) {
      alert("Please select a club first!");
      return;
    }
    if (!content.trim() && !file) {
      alert("Please enter content or attach an image.");
      return;
    }

    const form = new FormData();
    form.append("content", content);
    if (file) form.append("file", file);

    try {
      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      };
      let res;
      if (editingPost) {
        // ✏️ Update post
        res = await api.put(`/posts/${editingPost.id}`, form, { headers });
        setPosts((prev) =>
          prev.map((p) => (p.id === editingPost.id ? res.data : p))
        );
        alert("✅ Post updated successfully!");
      } else {
        // 🆕 Create new post
        res = await api.post(`/posts/club/${selectedClub}`, form, { headers });
        setPosts([res.data, ...posts]);
        alert("✅ Post created successfully!");
      }
      resetForm();
    } catch (err) {
      console.error("❌ Error saving post:", err);
      if (err.response?.data?.error) {
        alert(err.response.data.error);
      } else {
        alert("Failed to save post. Check console for details.");
      }
    }
  };

  // 🗑 Delete post
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((p) => p.id !== id));
      alert("🗑 Post deleted!");
    } catch (err) {
      console.error("❌ Failed to delete post:", err);
      alert("Failed to delete post.");
    }
  };

  // ✏️ Edit post
  const handleEdit = (post) => {
    setEditingPost(post);
    setContent(post.content);
    setSelectedClub(post.club?.id || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setContent("");
    setFile(null);
    setEditingPost(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="manage-posts">
      <h2 className="manager-title">
        {editingPost ? "Edit Post" : "Manage Posts"}
      </h2>

      {/* Post Form */}
      <form className="post-form" onSubmit={handleSubmit}>
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

        <textarea
          placeholder="Write something interesting..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={(e) => setFile(e.target.files[0])}
        />

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {editingPost ? "Update Post" : "Create Post"}
          </button>
          {editingPost && (
            <button type="button" className="btn-cancel" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Posts List */}
      <div className="posts-list">
        {posts.length === 0 ? (
          <p className="no-posts">No posts yet.</p>
        ) : (
          posts.map((p) => (
            <div key={p.id} className="post-card">
              <div className="post-header">
                <strong>{p.club?.name || "Unknown Club"}</strong>
                <span>
                  {new Date(p.createdAt).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>

              <p className="post-content">{p.content}</p>

              {p.imageUrl && (
                <img src={p.imageUrl} alt="Post" className="post-image" />
              )}

              <div className="post-footer">
                <button onClick={() => handleEdit(p)}>✏️ Edit</button>
                <button onClick={() => handleDelete(p.id)}>🗑 Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
