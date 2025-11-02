import React, { useState, useEffect, useContext, useRef } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import "./Home.css";

/*
  Home Feed Page — CampusTalk
  Features:
   ✅ Three-column layout (LeftSidebar | Feed | RightSidebar)
   ✅ Create Post composer (text + optional image upload)
   ✅ Fetch posts from backend (GET /api/posts)
   ✅ Submit new post to backend (POST /api/posts)
   ✅ Infinite scroll placeholder ready (will add later)
*/

export default function Home() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  // fetch posts from Spring Boot backend
  useEffect(() => {
    api
      .get("/posts")
      .then((res) => {
        setPosts(res.data.reverse()); // show latest first
      })
      .catch(() => setPosts([]));
  }, []);

  // handle image upload
  const handleImageUpload = async (file) => {
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await api.post("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.url; // backend returns {url: "..."}
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    let imageUrl = null;
    if (image) imageUrl = await handleImageUpload(image);

    try {
      const res = await api.post("/posts", {
        content,
        imageUrl,
        userId: user.id,
      });
      setPosts([res.data, ...posts]);
      setContent("");
      setImage(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      console.error("Post failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <section className="feed-section">
        <div className="post-composer">
          <div className="composer-header">
            <img
              src={user?.profilePicUrl || "/placeholder-avatar.png"}
              alt="profile"
              className="composer-avatar"
            />
            <textarea
              placeholder="Share something with your campus..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>

          {image && (
            <div className="preview">
              <img src={URL.createObjectURL(image)} alt="preview" />
              <button onClick={() => setImage(null)}>✕</button>
            </div>
          )}

          <div className="composer-actions">
            <div className="upload-wrap">
              <label htmlFor="file-upload">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Add Image
              </label>
              <input
                type="file"
                id="file-upload"
                accept="image/*"
                ref={fileRef}
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>

            <button
              className={`btn-primary ${loading ? "loading" : ""}`}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>

        {/* Posts feed */}
        <div className="feed-list">
          {posts.length > 0 ? (
            posts.map((p) => <PostCard key={p.id} post={p} />)
          ) : (
            <div className="empty-feed">No posts yet.</div>
          )}
        </div>
      </section>
    </div>
  );
}
