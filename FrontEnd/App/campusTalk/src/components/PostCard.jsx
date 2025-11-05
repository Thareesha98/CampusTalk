import React, { useState } from "react";
import api from "../api";
import "./PostCard.css";

export default function PostCard({ post }) {
  const [likes, setLikes] = useState(post.likes || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [visibleCount, setVisibleCount] = useState(3);
  const [commentText, setCommentText] = useState("");
  const [sending, setSending] = useState(false);
  const token = localStorage.getItem("token");

  // ❤️ Like post
  const handleLike = async () => {
    try {
      const res = await api.post(`/posts/${post.id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLikes(res.data.likes);
    } catch (err) {
      console.error("❌ Failed to like post:", err);
    }
  };

  // 💬 Add new comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || sending) return;

    setSending(true);
    try {
      const res = await api.post(
        `/posts/${post.id}/comment`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Build DTO-style object to match backend structure
      const newComment = {
        id: res.data.id,
        text: res.data.text,
        createdAt: res.data.createdAt,
        userName: res.data.user?.name || "You",
        userProfilePicUrl: res.data.user?.profilePicUrl || "/placeholder-avatar.png",
      };

      setComments((prev) => [...prev, newComment]);
      setCommentText("");
    } catch (err) {
      console.error("❌ Failed to send comment:", err);
    } finally {
      setSending(false);
    }
  };

  // 🧩 Load more comments
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  // Slice visible comments
  const visibleComments = comments.slice(0, visibleCount);

  return (
    <div className="postcard-container">
      <div className="post-card">
        {/* HEADER */}
        <div className="post-header">
          <div className="header-left">
            <img
              src={post.userProfilePicUrl || "/placeholder-avatar.png"}
              alt="user avatar"
              className="post-avatar"
            />
            <div className="post-meta">
              <strong>{post.userName || "Unknown User"}</strong>
              <p className="muted">
                {new Date(post.createdAt).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="post-body">
          <p className="post-content">{post.content}</p>
          {post.imageUrl && (
            <div className="post-image-wrap">
              <img src={post.imageUrl} alt="post" className="post-image" />
            </div>
          )}
        </div>

        {/* FOOTER — Like + Comment */}
        <div className="post-footer">
          <div className="footer-left">
            <button className="action-btn" onClick={handleLike}>
              ❤️ {likes}
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="footer-right comment-form-inline"
          >
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={sending}
            />
            <button type="submit" disabled={sending}>
              {sending ? "..." : "💬"}
            </button>
          </form>
        </div>

        {/* COMMENTS */}
        {comments.length > 0 && (
          <div className="comment-section">
            {visibleComments.map((c) => (
              <div key={c.id} className="comment-item">
                <img
                  src={c.userProfilePicUrl || "/placeholder-avatar.png"}
                  alt={c.userName}
                  className="comment-avatar"
                />
                <div className="comment-body">
                  <strong>{c.userName || "Anonymous"}:</strong>
                  <p>{c.text}</p>
                </div>
              </div>
            ))}

            {/* Load More Button */}
            {comments.length > visibleCount && (
              <button className="load-more-btn" onClick={handleLoadMore}>
                View more comments ({comments.length - visibleCount})
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
