import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import { AuthContext } from "../../context/AuthContext";
import "./UniversityDetails.css";

export default function UniversityDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [uni, setUni] = useState(null);
  const [loadingFollow, setLoadingFollow] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Load university details. Backend provides:
  // - clubs: [{ id, name, profilePicUrl, followerCount, isFollowing, followerIds }]
  const loadDetails = async () => {
    try {
      const res = await api.get(`/universities/${id}/details`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const university = res.data;

      // Ensure each club has consistent fields and safe fallbacks
      const enrichedClubs = (university.clubs || []).map((club) => {
        const followerCount =
          typeof club.followerCount === "number"
            ? club.followerCount
            : (club.followerIds ? club.followerIds.length : 0);

        // Prefer backend isFollowing when available; fallback to local user id check
        const isFollowing =
          typeof club.isFollowing === "boolean"
            ? club.isFollowing
            : !!(club.followerIds && user?.id && club.followerIds.includes(user.id));

        return {
          ...club,
          followerCount,
          isFollowing,
        };
      });

      setUni({
        ...university,
        clubs: enrichedClubs,
      });
    } catch (e) {
      console.error("Failed to load details:", e);
    }
  };

  // Follow/unfollow
  const handleFollowToggle = async (club) => {
    if (!token) {
      alert("Please login to follow clubs.");
      return;
    }

    try {
      setLoadingFollow(club.id);

      const endpoint = club.isFollowing
        ? `/clubs/${club.id}/unfollow`
        : `/clubs/${club.id}/follow`;

      await api.post(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update UI instantly and keep followerIds in sync conservatively
      setUni((prev) => ({
        ...prev,
        clubs: prev.clubs.map((c) =>
          c.id === club.id
            ? {
                ...c,
                isFollowing: !c.isFollowing,
                followerCount: c.isFollowing ? Math.max(0, c.followerCount - 1) : c.followerCount + 1,
                // Optionally update followerIds locally if user id available
                followerIds: user?.id
                  ? (c.isFollowing
                      ? (c.followerIds || []).filter((fid) => fid !== user.id)
                      : [...(c.followerIds || []), user.id])
                  : c.followerIds,
              }
            : c
        ),
      }));
    } catch (err) {
      console.error("Follow/Unfollow failed:", err);
      // Optionally reload to ensure canonical state
      // await loadDetails();
    } finally {
      setLoadingFollow(null);
    }
  };

  if (!uni)
    return <p className="muted" style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div className="uni-detail-page">
      <div className="uni-hero">
        <img src={uni.imageUrl || "/default-uni.jpg"} alt={uni.name} />
      </div>

      <div className="uni-detail-content">
        <div className="uni-header">
          <img
            src={uni.logoUrl || "/default-logo.png"}
            alt={uni.name}
            className="uni-logo"
          />
          <h2>{uni.name}</h2>
        </div>

        <p className="muted">{uni.location}</p>
        <p className="uni-description">{uni.description}</p>

        <hr />

        <h3>Clubs in this University</h3>

        <div className="clubs-grid">
          {uni.clubs?.length > 0 ? (
            uni.clubs.map((c) => (
              <div key={c.id} className="club-card">
                <img
                  src={c.profilePicUrl || "/club-placeholder.png"}
                  alt={c.name}
                />

                <p className="club-name">{c.name}</p>
                <p className="club-followers">{c.followerCount} followers</p>

                <button
                  className={`btn-follow ${c.isFollowing ? "following" : ""}`}
                  onClick={() => handleFollowToggle(c)}
                  disabled={loadingFollow === c.id}
                >
                  {loadingFollow === c.id
                    ? "Processing..."
                    : c.isFollowing
                    ? "Following"
                    : "Follow"}
                </button>
              </div>
            ))
          ) : (
            <p>No clubs found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
