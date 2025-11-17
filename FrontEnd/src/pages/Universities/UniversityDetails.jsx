import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import "./UniversityDetails.css";

export default function UniversityDetails() {
  const { id } = useParams();
  const [uni, setUni] = useState(null);

  useEffect(() => {
    api.get(`/universities/${id}/details`).then((res) => setUni(res.data));
  }, [id]);

  if (!uni) return <p className="muted">Loading...</p>;

  return (
    <div className="uni-detail-page">
      <div className="uni-hero">
        <img src={uni.imageUrl || "/default-uni.jpg"} alt={uni.name} />
      </div>

      <div className="uni-detail-content">
        <h2>{uni.name}</h2>
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
                <p>{c.name}</p>
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
