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
  const [followingClub, setFollowingClub] = useState(null);

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

      // 2️⃣ Enrich with counts + follow status
      const enriched = await Promise.all(
        allClubs.map(async (club) => {
          let memberCount = 0;
          let eventCount = 0;
          let followerCount = club.followers ? club.followers.length : 0;

          // ✅ determine if current user already follows
          const isFollowing =
            club.followers &&
            club.followers.some((f) => f.id === user?.id);

          try {
            const [membersRes, eventsRes] = await Promise.all([
              api.get(`/clubs/${club.id}/members`),
              api.get(`/events/club/${club.id}`).catch(() => ({ data: [] })),
            ]);
            memberCount = membersRes.data.length;
            eventCount = eventsRes.data.length;
          } catch (err) {
            console.warn(`⚠️ Count fetch failed for club ${club.id}`, err);
          }

          return {
            ...club,
            memberCount,
            eventCount,
            followerCount,
            isFollowing,
          };
        })
      );

      // 3️⃣ Load universities
      const uniRes = await api.get("/universities");
      setUniversities(uniRes.data);

      // 4️⃣ Apply search/filter
      const filtered = enriched.filter((c) => {
        const matchesSearch = c.name
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesUni =
          selectedUni === "all" || c.university?.id === Number(selectedUni);
        return matchesSearch && matchesUni;
      });

      setClubs(filtered);
    } catch (err) {
      console.error("❌ Failed to load clubs:", err);
      setClubs([]);
    } finally {
      setLoading(false);
    }
  };

  // ❤️ Handle Follow/Unfollow Toggle
  const handleFollowToggle = async (club) => {
    if (!token) {
      alert("Please log in to follow clubs.");
      return;
    }

    try {
      setFollowingClub(club.id);
      const endpoint = club.isFollowing
        ? `/clubs/${club.id}/unfollow`
        : `/clubs/${club.id}/follow`;

      await api.post(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Update state instantly for better UX
      setClubs((prev) =>
        prev.map((c) =>
          c.id === club.id
            ? {
                ...c,
                isFollowing: !c.isFollowing,
                followerCount: c.isFollowing
                  ? c.followerCount - 1
                  : c.followerCount + 1,
              }
            : c
        )
      );
    } catch (err) {
      console.error("❌ Follow/unfollow failed:", err);
    } finally {
      setFollowingClub(null);
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
                  
                 
                  <div className="club-meta">
                    <span>{c.memberCount} Members</span>
                   
                  </div>
                   
                  <div className="club-meta">
                    <span>{c.followerCount} Followers</span>
                  </div>

                  <span>{c.eventCount} Events</span>


                  <button
                    className={`btn-join ${c.isFollowing ? "joined" : ""}`}
                    onClick={() => handleFollowToggle(c)}
                    disabled={followingClub === c.id}
                  >
                    {followingClub === c.id
                      ? "Processing..."
                      : c.isFollowing
                      ? "Following"
                      : "Follow"}
                  </button>

                  <div className="university-info">
                    <h3>{c.name}</h3>
                    <p className="muted">
                      {c.university?.name || "Unknown University"}
                    </p>
                  </div>

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
