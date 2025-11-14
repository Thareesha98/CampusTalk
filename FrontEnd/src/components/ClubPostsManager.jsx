// src/components/ClubPostsManager.jsx
import React, { useState, useEffect, useRef } from "react";
import api from "../api";
import "./ClubPostsManager.css";

export default function ClubPostsManager({ clubId }) {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const fileRef = useRef();
  const token = localStorage.getItem("token");

  // 🔁 Fetch posts for this club
  useEffect(() => {
    fetchClubPosts();
  }, [clubId]);

  const fetchClubPosts = async () => {
    try {
      const res = await api.get(`/posts/club/${clubId}`);
      setPosts(res.data);
    } catch (err) {
      console.error("❌ Failed to load posts:", err);
    }
  };

  // 🖊 Create or update a post
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!clubId) {
  alert("Missing club ID! Please select or open a club first.");
  return;
}


    if (!content.trim() && !file) {
      alert("Please add content or an image.");
      return;
    }

    setLoading(true);
    const form = new FormData();
    form.append("content", content);
    if (file) form.append("file", file);

    try {
      let res;
      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      };

      if (editingPost) {
        // ✏️ Update existing post
        res = await api.put(`/posts/${editingPost.id}`, form, { headers });
      } else {
        // 🆕 Create new post
        res = await api.post(`/posts/club/${clubId}`, form, { headers });
      }

      const newPost = res.data;
      setPosts((prev) =>
        editingPost
          ? prev.map((p) => (p.id === editingPost.id ? newPost : p))
          : [newPost, ...prev]
      );

      alert(editingPost ? "✅ Post updated!" : "✅ Post created!");
      resetForm();
    } catch (err) {
      console.error("❌ Error saving post:", err);
      alert("Failed to save post. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // 🗑 Delete a post
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((p) => p.id !== id));
      alert("🗑 Post deleted");
    } catch (err) {
      console.error("❌ Failed to delete post:", err);
      alert("Failed to delete post");
    }
  };

  // ✏️ Edit mode
  const handleEdit = (post) => {
    setEditingPost(post);
    setContent(post.content);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🔄 Reset form
  const resetForm = () => {
    setContent("");
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
    setEditingPost(null);
  };

  return (
    <div className="club-posts-manager">
      <h3 className="manager-title">Club Posts</h3>

      {/* Post Form */}
      <form className="post-form" onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write something interesting..."
        />
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={(e) => setFile(e.target.files[0])}
        />

        <div className="form-actions">
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading
              ? "⏳ Saving..."
              : editingPost
              ? "Update Post"
              : "Create Post"}
          </button>
          {editingPost && (
            <button
              type="button"
              className="btn-cancel"
              onClick={resetForm}
              disabled={loading}
            >
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
            <div className="post-card" key={p.id}>
              <div className="post-header">
                <div className="post-author">
                  <img
                    src={p.user?.profilePicUrl || "/placeholder-avatar.png"}
                    alt={p.user?.name}
                  />
                  <div>
                    <strong>{p.user?.name}</strong>
                    <span className="post-date">
                      {new Date(p.createdAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                </div>

                <div className="post-actions">
                  <button onClick={() => handleEdit(p)}>Edit</button>
                  <button onClick={() => handleDelete(p.id)}>Delete</button>
                </div>
              </div>

              <p className="post-content">{p.content}</p>

              {p.imageUrl && (
                <img src={p.imageUrl} alt="Post" className="post-image" />
              )}

              <div className="post-stats">
                <span>❤️ {p.likes || 0}</span>
                <span>💬 {p.comments?.length || 0}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
