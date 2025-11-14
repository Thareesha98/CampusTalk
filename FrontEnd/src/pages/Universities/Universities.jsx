import React, { useEffect, useState } from "react";
import api from "../../api";
import "./Universities.css";

/*
  Universities Page — CampusTalk
  ✅ Fetches and displays all universities (/api/universities)
  ✅ Shows name, city, total clubs & students count
  ✅ Includes details modal (faculties + clubs)
  ✅ Modern glass-grid layout
*/

export default function Universities() {
  const [universities, setUniversities] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api
      .get("/universities")
      .then((res) => setUniversities(res.data))
      .catch(() => setUniversities([]));
  }, []);

  const openModal = (uni) => {
    setSelected(uni);
  };

  const closeModal = () => setSelected(null);

  return (
    <div className="universities-page">
      <h2>Universities</h2>
      <div className="universities-grid">
        {universities.length > 0 ? (
          universities.map((u) => (
            <div
              key={u.id}
              className="university-card"
              onClick={() => openModal(u)}
            >
              <div className="uni-banner"></div>
              <div className="uni-body">
                <h3>{u.name}</h3>
                <p className="muted">{u.city}</p>
                <div className="uni-stats">
                  <span>{u.clubCount || 0} Clubs</span>
                  <span>{u.studentCount || 0} Students</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="muted">No universities found.</p>
        )}
      </div>

      {/* Details Modal */}
      {selected && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="university-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{selected.name}</h3>
            <p className="muted">{selected.city}</p>

            <div className="uni-section">
              <h4>Faculties</h4>
              {selected.faculties && selected.faculties.length > 0 ? (
                <ul>
                  {selected.faculties.map((f) => (
                    <li key={f.id}>{f.name}</li>
                  ))}
                </ul>
              ) : (
                <p>No faculties available.</p>
              )}
            </div>

            <div className="uni-section">
              <h4>Clubs</h4>
              {selected.clubs && selected.clubs.length > 0 ? (
                <div className="modal-club-list">
                  {selected.clubs.map((c) => (
                    <div key={c.id} className="modal-club-item">
                      <img
                        src={c.imageUrl || "/club-placeholder.png"}
                        alt={c.name}
                      />
                      <span>{c.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No clubs yet.</p>
              )}
            </div>

            <button className="btn-primary" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
