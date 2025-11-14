import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./CreateClub.css";

export default function CreateClub() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !description.trim()) {
      setError("Please enter club name and description.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");
    let imageUrl = null; // ✅ holds S3 URL

    try {
      // ✅ Step 1: Create the club first (without image)
      const payload = { name, description };
      const res = await api.post("/clubs", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const createdClub = res.data;
      console.log("✅ Club created:", createdClub);

      // ✅ Step 2: Upload image (if any)
      if (file) {
        const form = new FormData();
        form.append("file", file);

        try {
          const uploadRes = await api.post(
            `/clubs/${createdClub.id}/upload-profile-pic`,
            form,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          imageUrl = uploadRes.data.url;
          console.log("🖼 Uploaded image:", imageUrl);
        } catch (err) {
          console.error("Image upload failed:", err.response?.data || err.message);
          alert("Image upload failed. Club was created without image.");
        }
      }

      alert("🎉 Club created successfully!");
      navigate(`/dashboard/club/${createdClub.id}`);
    } catch (err) {
      console.error("❌ Club creation failed:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to create club.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-club-page">
      <div className="create-club-card">
        <h2>Create New Club</h2>
        <p className="muted">As a chairman or admin, you can register your club here.</p>

        <form onSubmit={handleCreate}>
          <label>Club Name</label>
          <input
            type="text"
            placeholder="e.g. AI Research Club"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Description</label>
          <textarea
            placeholder="Describe your club’s goals and activities..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          <label>Club Profile Picture</label>
          {file && (
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="preview-avatar"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                marginBottom: "10px",
              }}
            />
          )}
          <input
            type="file"
            ref={fileRef}
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Club"}
          </button>
        </form>
      </div>
    </div>
  );
}
