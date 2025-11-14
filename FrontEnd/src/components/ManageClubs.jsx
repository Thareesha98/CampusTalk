import React, { useEffect, useState, useRef } from "react";
import api from "../api";
import "./ManageClubs.css";

export default function ManageClubs() {
  const [clubs, setClubs] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [editingClub, setEditingClub] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();
  const token = localStorage.getItem("token");

  // 🔁 Fetch all clubs
  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const res = await api.get("/clubs");
      setClubs(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch clubs:", err);
    }
  };

  // 🖊 Create or Update Club
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a club name");
      return;
    }

    setLoading(true);
    const form = new FormData();
    form.append("name", name);
    form.append("description", description);
    if (file) form.append("file", file);

    try {
      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      };
      let res;
      if (editingClub) {
        res = await api.put(`/clubs/${editingClub.id}`, form, { headers });
        setClubs((prev) =>
          prev.map((c) => (c.id === editingClub.id ? res.data : c))
        );
        alert("✅ Club updated!");
      } else {
        res = await api.post("/clubs", form, { headers });
        setClubs([res.data, ...clubs]);
        alert("✅ Club created!");
      }
      resetForm();
    } catch (err) {
      console.error("❌ Failed to save club:", err);
      alert("Error saving club. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // 🗑 Delete Club
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this club?")) return;
    try {
      await api.delete(`/clubs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClubs((prev) => prev.filter((c) => c.id !== id));
      alert("🗑 Club deleted!");
    } catch (err) {
      console.error("❌ Failed to delete club:", err);
      alert("Error deleting club");
    }
  };

  // ✏️ Edit Club
  const handleEdit = (club) => {
    setEditingClub(club);
    setName(club.name);
    setDescription(club.description);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingClub(null);
    setName("");
    setDescription("");
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="manage-clubs">
      <h2 className="manager-title">
        {editingClub ? "Edit Club" : "Manage Clubs"}
      </h2>

      {/* Club Form */}
      <form className="club-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Club name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          placeholder="Club description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="file"
          ref={fileRef}
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <div className="form-actions">
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading
              ? "⏳ Saving..."
              : editingClub
              ? "Update Club"
              : "Create Club"}
          </button>
          {editingClub && (
            <button
              type="button"
              className="btn-cancel"
              onClick={resetForm}
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Clubs List */}
      <div className="clubs-list">
        {clubs.length === 0 ? (
          <p className="no-clubs">No clubs available.</p>
        ) : (
          clubs.map((club) => (
            <div className="club-card" key={club.id}>
              <div className="club-info">
                <img
                  src={club.profilePicUrl || "/placeholder-club.png"}
                  alt={club.name}
                  className="club-logo"
                />
                <div>
                  <h4>{club.name}</h4>
                  <p>{club.description}</p>
                </div>
              </div>

              <div className="club-actions">
                <button onClick={() => handleEdit(club)}>Edit</button>
                <button onClick={() => handleDelete(club.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
