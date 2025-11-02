import React, { useEffect, useState, useContext } from "react";
import api from "../../api";
import { AuthContext } from "../../context/AuthContext";
import "./Clubs.css";

/*
  Clubs Page — CampusTalk
  ✅ Fetches all clubs (/api/clubs)
  ✅ Filter by university (/api/universities)
  ✅ Search clubs by name (/api/clubs/search?query=)
  ✅ Join / Leave clubs (POST /api/clubs/{id}/join)
*/

export default function Clubs() {
  const { user } = useContext(AuthContext);
  const [clubs, setClubs] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [selectedUni, setSelectedUni] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [joiningClub, setJoiningClub] = useState(null);

  useEffect(() => {
    loadClubs();
    api.get("/universities").then((res) => setUniversities(res.data));
  }, []);

  const loadClubs = (uni = selectedUni, q = search) => {
    setLoading(true);
    let endpoint = "/clubs";
    if (uni !== "all") endpoint = `/clubs/university/${uni}`;
    if (q) endpoint = `/clubs/search?query=${encodeURIComponent(q)}`;
    api
      .get(endpoint)
      .then((res) => setClubs(res.data))
      .catch(() => setClubs([]))
      .finally(() => setLoading(false));
  };

  const handleJoin = async (clubId) => {
    try {
      setJoiningClub(clubId);
      await api.post(`/clubs/${clubId}/join`, { userId: user.id });
      setClubs((prev) =>
        prev.map((c) =>
          c.id === clubId ? { ...c, joined: !c.joined } : c
        )
      );
    } catch (err) {
      console.error("Join failed:", err);
    } finally {
      setJoiningClub(null);
    }
  };

  return (
    <div className="clubs-page">
      <h2>Explore Clubs</h2>

      {/* Filters */}
      <div className="club-filters">
        <select
          value={selectedUni}
          onChange={(e) => {
            setSelectedUni(e.target.value);
            loadClubs(e.target.value);
          }}
        >
          <option value="all">All Universities</option>
          {universities.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search clubs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && loadClubs()}
        />
        <button className="btn-primary" onClick={() => loadClubs()}>
          Search
        </button>
      </div>

      {/* Clubs Grid */}
      {loading ? (
        <p className="muted">Loading clubs...</p>
      ) : (
        <div className="clubs-grid">
          {clubs.length > 0 ? (
            clubs.map((c) => (
              <div key={c.id} className="club-card">
                <div className="club-banner">
                  <img
                    src={c.imageUrl || "/club-placeholder.png"}
                    alt={c.name}
                  />
                </div>
                <div className="club-info">
                  <h3>{c.name}</h3>
                  <p className="muted">
                    {c.university?.name || "Unknown University"}
                  </p>
                  <div className="club-meta">
                    <span>{c.memberCount || 0} Members</span>
                    <span>{c.eventCount || 0} Events</span>
                  </div>
                  <button
                    className={`btn-join ${c.joined ? "joined" : ""}`}
                    onClick={() => handleJoin(c.id)}
                    disabled={joiningClub === c.id}
                  >
                    {joiningClub === c.id
                      ? "Processing..."
                      : c.joined
                      ? "Joined"
                      : "Join"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="muted">No clubs found.</p>
          )}
        </div>
      )}
    </div>
  );
}
