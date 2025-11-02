// src/pages/Search/Search.jsx
import React, { useState } from "react";
import api from "../api";
import "./Search.css";

/*
  Simple search across users, clubs, posts
  Backend endpoints:
    - /search/users?q=
    - /search/clubs?q=
    - /search/posts?q=
  (or use combined endpoint /search?q=)
*/

export default function Search() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState({ users: [], clubs: [], posts: [] });
  const [loading, setLoading] = useState(false);

  const doSearch = async () => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      // try combined endpoint first
      let res = await api.get(`/search?q=${encodeURIComponent(q)}`);
      setResults(res.data);
    } catch (e) {
      // fallback to separate endpoints if combined not available
      const [u, c, p] = await Promise.allSettled([
        api.get(`/search/users?q=${encodeURIComponent(q)}`),
        api.get(`/search/clubs?q=${encodeURIComponent(q)}`),
        api.get(`/search/posts?q=${encodeURIComponent(q)}`),
      ]);
      setResults({
        users: u.status === "fulfilled" ? u.value.data : [],
        clubs: c.status === "fulfilled" ? c.value.data : [],
        posts: p.status === "fulfilled" ? p.value.data : [],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page">
      <div className="search-box">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search people, clubs, posts..." />
        <button className="btn-primary" onClick={doSearch} disabled={loading}>{loading ? "Searching..." : "Search"}</button>
      </div>

      <div className="search-results">
        <section>
          <h3>People</h3>
          {results.users.length === 0 ? <p className="muted">No people found.</p> : results.users.map(u => <div key={u.id} className="search-item">{u.username} <span className="muted">• {u.university?.name}</span></div>)}
        </section>

        <section>
          <h3>Clubs</h3>
          {results.clubs.length === 0 ? <p className="muted">No clubs found.</p> : results.clubs.map(c => <div key={c.id} className="search-item">{c.name} <span className="muted">• {c.university?.name}</span></div>)}
        </section>

        <section>
          <h3>Posts</h3>
          {results.posts.length === 0 ? <p className="muted">No posts found.</p> : results.posts.map(p => <div key={p.id} className="search-item">{p.content.slice(0,120)} <span className="muted">• {new Date(p.createdAt).toLocaleString()}</span></div>)}
        </section>
      </div>
    </div>
  );
}
