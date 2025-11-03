import React, { useEffect, useState, useContext } from "react";
import api from "../../api";
import { AuthContext } from "../../context/AuthContext";
import "./Clubs.css";

export default function Clubs() {
  const { user } = useContext(AuthContext);
  const [clubs, setClubs] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [selectedUni, setSelectedUni] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [joiningClub, setJoiningClub] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      // 1️⃣ Fetch all clubs
      const clubsRes = await api.get("/clubs");
      let allClubs = clubsRes.data;

      // 2️⃣ Fetch clubs that user has joined
      const joinedRes = await api.get("/clubs/joined", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const joinedIds = joinedRes.data.map((c) => c.id);

      // 3️⃣ Merge joined status
      const merged = allClubs.map((club) => ({
        ...club,
        joined: joinedIds.includes(club.id),
      }));

      setClubs(merged);

      // 4️⃣ Load universities
      const uniRes = await api.get("/universities");
      setUniversities(uniRes.data);
    } catch (err) {
      console.error("❌ Failed to load clubs/universities:", err);
      setClubs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (clubId) => {
    try {
      setJoiningClub(clubId);
      await api.post(`/clubs/${clubId}/join`, { userId: user.id });
      await loadAllData(); // ✅ Refresh joined state from backend
    } catch (err) {
      console.error("❌ Join failed:", err);
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
          onChange={(e) => setSelectedUni(e.target.value)}
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
        />
        <button className="btn-primary" onClick={loadAllData}>
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
                    src={c.profilePicUrl || "/club-placeholder.png"}
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
