import React, { useState } from "react";
import "./PostCard.css";

export default function PostCard({ post, onLike, onComment }) {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onComment(post.id, commentText);
    setCommentText("");
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <img
          src={post.user?.profilePicUrl || "/placeholder-avatar.png"}
          alt="user"
          className="post-avatar"
        />
        <div>
          <strong>{post.user?.name}</strong>
          <p className="muted">
            {new Date(post.createdAt).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
      </div>

      <p className="post-content">{post.content}</p>

      {post.imageUrl && (
        <img src={post.imageUrl} alt="post" className="post-image" />
      )}

      <div className="post-actions">
        <button onClick={onLike}>❤️ {post.likes || 0}</button>
      </div>

      <div className="comments-section">
        {post.comments?.map((c) => (
          <div key={c.id} className="comment">
            <strong>{c.user?.name}:</strong> {c.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="comment-form">
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button type="submit">💬</button>
      </form>
    </div>
  );
}
