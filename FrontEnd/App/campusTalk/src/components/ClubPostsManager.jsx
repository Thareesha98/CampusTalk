// src/components/ClubPostsManager.jsx
import React, { useState, useEffect, useRef } from "react";
import api from "../api";
import "./ClubPostsManager.css";

export default function ClubPostsManager({ clubId }) {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const fileRef = useRef();
  const token = localStorage.getItem("token");

  // 🧩 Fetch posts for this club
  useEffect(() => {
    api
      .get(`/posts/club/${clubId}`)
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("Failed to load posts:", err));
  }, [clubId]);

  // 🖊 Create or update a post
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() && !file) {
      alert("Please add content or an image.");
      return;
    }

    const form = new FormData();
    form.append("content", content);
    if (file) form.append("file", file);

    try {
      let res;

      if (editingPost) {
        // 🧩 Edit existing post (if backend supports PUT multipart)
        res = await api.put(`/posts/${editingPost.id}`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // 🆕 Create new post
        res = await api.post(`/posts/club/${clubId}`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      const newPost = res.data;
      if (editingPost) {
        setPosts(posts.map((p) => (p.id === editingPost.id ? newPost : p)));
        alert("✅ Post updated!");
      } else {
        setPosts([newPost, ...posts]);
        alert("✅ Post created!");
      }

      // Reset form
      setContent("");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      setEditingPost(null);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save post");
    }
  };

  // 🗑 Delete a post
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.delete(`/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((p) => p.id !== id));
      alert("🗑 Post deleted");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete post");
    }
  };

  // ✏️ Edit a post
  const handleEdit = (post) => {
    setEditingPost(post);
    setContent(post.content);
  };

  return (
    <div className="club-posts-manager">
      <h3>Club Posts</h3>

      {/* Post Form */}
      <form className="post-form" onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a post..."
        />
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button className="btn-primary" type="submit">
          {editingPost ? "Update Post" : "Create Post"}
        </button>
        {editingPost && (
          <button
            type="button"
            className="btn-cancel"
            onClick={() => {
              setEditingPost(null);
              setContent("");
              if (fileRef.current) fileRef.current.value = "";
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Posts List */}
      <div className="posts-list">
        {posts.length === 0 ? (
          <p>No posts yet.</p>
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
                    <span>
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
