// src/components/FileUpload/FileUpload.jsx
import React, { useState } from "react";
import api from "../../api";
import "./FileUpload.css";

/*
  Small reusable file upload component for images.
  Usage:
    <FileUpload onComplete={(url) => {...}} accept="image/*" />
  returns uploaded URL via onComplete.
*/

export default function FileUpload({ onComplete, accept = "image/*" }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function onFileChange(e) {
    const f = e.target.files[0];
    if (!f) return;
    const form = new FormData();
    form.append("file", f);
    try {
      setUploading(true);
      const res = await api.post("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (ev) => {
          const p = Math.round((ev.loaded * 100) / ev.total);
          setProgress(p);
        },
      });
      onComplete && onComplete(res.data.url);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  return (
    <div className="file-upload">
      <label className="upload-label">
        <input type="file" accept={accept} onChange={onFileChange} />
        {uploading ? <div className="progress">Uploading {progress}%</div> : <span>Choose file</span>}
      </label>
    </div>
  );
}
