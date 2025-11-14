// src/components/ClubProfileEditor.jsx
import React, { useState } from "react";
import api from "../api";
import "./ClubProfileEditor.css";

export default function ClubProfileEditor({ club, setClub }) {
  const [name, setName] = useState(club.name);
  const [description, setDescription] = useState(club.description || "");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Step 1: Upload new image (if selected)
      let imageUrl = club.profilePicUrl;
      if (file) {
        const form = new FormData();
        form.append("file", file);
        const uploadRes = await api.post(
          `/clubs/${club.id}/upload-profile-pic`,
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        imageUrl = uploadRes.data.url;
      }

      // Step 2: Update club details
      const res = await api.put(
        `/clubs/${club.id}`,
        { name, description, profilePicUrl: imageUrl },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setClub(res.data);
      alert("✅ Club details updated!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update club");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="club-profile-editor">
      <h3>Edit Club Profile</h3>
      <form onSubmit={handleSave}>
        <label>Club Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Club Name"
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write about your club..."
        />

        <label>Profile Picture</label>
        {club.profilePicUrl && (
          <img
            src={club.profilePicUrl}
            alt="Club Avatar"
            className="club-avatar"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button className="btn-primary" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
