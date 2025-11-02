import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./CreateClub.css";

/*
  ✅ CreateClub Page
  - Only for Chairman/Admin
  - Upload optional profile pic
  - Auto-assigns current user as chairman
*/

export default function CreateClub() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [file, setFile] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/universities").then((res) => setUniversities(res.data));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !universityId) return alert("All fields required.");

    setLoading(true);
    const token = localStorage.getItem("token");
    let imageUrl = null;

    try {
      // Step 1 — upload image (optional)
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await api.post("/users/upload-profile-pic", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        imageUrl = uploadRes.data.url;
      }

      // Step 2 — create club
      const res = await api.post(
        "/clubs",
        {
          name,
          description,
          profilePicUrl: imageUrl,
          university: { id: universityId },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✅ Club created successfully!");
      navigate(`/club/${res.data.id}`);
    } catch (err) {
      console.error("❌ Club creation failed:", err.response?.data || err.message);
      alert("Error creating club. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-club-page">
      <div className="create-club-card">
        <h2>Create New Club</h2>
        <form onSubmit={handleCreate}>
          <label>Club Name</label>
          <input
            type="text"
            placeholder="Enter club name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Description</label>
          <textarea
            placeholder="Describe your club’s purpose..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label>University</label>
          <select
            value={universityId}
            onChange={(e) => setUniversityId(e.target.value)}
          >
            <option value="">Select University</option>
            {universities.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          <label>Profile Picture</label>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Club"}
          </button>
        </form>
      </div>
    </div>
  );
}
