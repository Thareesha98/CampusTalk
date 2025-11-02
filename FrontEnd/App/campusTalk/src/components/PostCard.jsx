import React, { useState, useEffect, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import "./PostCard.css";

/*
  PostCard Component — CampusTalk
  ✅ Displays user, time, post text, image
  ✅ Like system (POST /api/posts/{id}/like)
  ✅ Comment toggle (fetch + add comments)
  ✅ Matches Spring Boot entities (Post -> User -> Comments)
*/

export default function PostCard({ post }) {
  const { user } = useContext(AuthContext);
  const [liked, setLiked] = useState(post.likedBy?.includes(user?.id));
  const [likes, setLikes] = useState(post.likeCount || 0);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (showComments) {
      api
        .get(`/posts/${post.id}/comments`)
        .then((res) => setComments(res.data))
        .catch(() => setComments([]));
    }
  }, [showComments, post.id]);

  const handleLike = async () => {
    try {
      await api.post(`/posts/${post.id}/like`, { userId: user.id });
      setLiked(!liked);
      setLikes((prev) => (liked ? prev - 1 : prev + 1));
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await api.post(`/posts/${post.id}/comments`, {
        content: newComment,
        userId: user.id,
      });
      setComments([...comments, res.data]);
      setNewComment("");
    } catch (err) {
      console.error("Comment failed:", err);
    }
  };

  return (
    <article className="post-card">
      {/* Header */}
      <header className="post-header">
        <img
          src={post.user?.profileImage || "/placeholder-avatar.png"}
          alt={post.user?.username}
          className="avatar"
        />
        <div className="post-meta">
          <strong>{post.user?.username || "Anonymous"}</strong>
          <span className="muted">
            {new Date(post.createdAt).toLocaleString()}
          </span>
        </div>
      </header>

      {/* Body */}
      <div className="post-body">
        <p className="post-content">{post.content}</p>
        {post.imageUrl && (
          <div className="post-image-wrap">
            <img src={post.imageUrl} alt="post" className="post-image" />
          </div>
        )}
      </div>

      {/* Footer actions */}
      <footer className="post-footer">
        <div className="post-actions">
          <button
            className={`action-btn ${liked ? "liked" : ""}`}
            onClick={handleLike}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
                      4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 
                      3.81 14.76 3 16.5 3 19.58 3 22 5.42 
                      22 8.5c0 3.78-3.4 6.86-8.55 
                      11.54L12 21.35z" />
            </svg>
            <span>{likes}</span>
          </button>

          <button
            className="action-btn"
            onClick={() => setShowComments((s) => !s)}
          >
            💬 <span>{comments.length}</span>
          </button>
        </div>
      </footer>

      {/* Comments */}
      {showComments && (
        <div className="comment-section">
          {comments.map((c) => (
            <div key={c.id} className="comment-item">
              <img
                src={c.user?.profileImage || "/placeholder-avatar.png"}
                alt={c.user?.username}
                className="comment-avatar"
              />
              <div className="comment-body">
                <strong>{c.user?.username}</strong>
                <p>{c.content}</p>
                <span className="muted">
                  {new Date(c.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}

          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit">Post</button>
          </form>
        </div>
      )}
    </article>
  );
}
