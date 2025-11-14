import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api";
import "./Profile.css";
import PostCard from "../components/PostCard";

/*
  Profile Page — CampusTalk
  ✅ Shows detailed user info & posts
  ✅ Edit Profile (PUT /api/users/{id})
  ✅ Upload image (POST /api/users/upload-profile-pic)
  ✅ Instantly updates Navbar picture
  ✅ Fully responsive
*/

export default function Profile() {
  const { id } = useParams();
  const { user, updateUserProfile } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [file, setFile] = useState(null);
  const fileRef = useRef();

  // ✅ Fetch user profile + posts
  useEffect(() => {
    api
      .get(`/users/${id}`)
      .then((res) => {
        setProfile(res.data);
        setBio(res.data.bio || "");
      })
      .catch(() => setProfile(null));

    api
      .get(`/posts/user/${id}`)
      .then((res) => setPosts(res.data.reverse()))
      .catch(() => setPosts([]));
  }, [id]);





// const handleUpdate = async (e) => {
//   e.preventDefault();
//   let imageUrl = profile.profilePicUrl;
//   const token = localStorage.getItem("token");

//   // ✅ Step 1: Upload new image (if selected)
//   if (file) {
//     const form = new FormData();
//     form.append("file", file);

//     try {
//       const res = await api.post("/users/upload-profile-pic", form, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       imageUrl = res.data.url; // ✅ backend returns { message, url }
//     } catch (err) {
//       console.error("Upload failed:", err.response?.data || err.message);
//       alert("Image upload failed. Please try again.");
//       return;
//     }
//   }

//   // ✅ Step 2: Send JSON for bio + imageUrl
//   try {
//     const updated = await api.put(
//       `/users/${id}`,
//       {
//         bio,
//         profilePicUrl: imageUrl,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     setProfile(updated.data);
//     setEditing(false);
//     setFile(null);
//     if (fileRef.current) fileRef.current.value = "";
//   } catch (err) {
//     console.error("Update failed:", err.response?.data || err.message);
//     alert("Profile update failed. Please try again.");
//   }
// };





const handleUpdate = async (e) => {
  e.preventDefault();
  let imageUrl = profile.profilePicUrl;
  const token = localStorage.getItem("token");

  // ✅ Step 1: Upload new image (if selected)
  if (file) {
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await api.post("/users/upload-profile-pic", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      imageUrl = res.data.url; // ✅ backend returns { message, url }
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
      alert("Image upload failed. Please try again.");
      return;
    }
  }

  // ✅ Step 2: Send JSON for bio + imageUrl
  try {
    const updated = await api.put(
      `/users/${id}`,
      {
        bio,
        profilePicUrl: imageUrl,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // ✅ Step 3: Update local profile state
    setProfile(updated.data);

    // ✅ Step 4: Update global AuthContext (for Navbar)
    updateUserProfile({
      profilePicUrl: updated.data.profilePicUrl,
      bio: updated.data.bio,
    });

    // ✅ Step 5: Cleanup
    setEditing(false);
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
  } catch (err) {
    console.error("Update failed:", err.response?.data || err.message);
    alert("Profile update failed. Please try again.");
  }
};














  if (!profile)
    return (
      <div className="profile-page center">
        <p>Profile not found.</p>
      </div>
    );

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div className="cover"></div>
        <div className="profile-main">
          <img
            src={profile.profilePicUrl || "/placeholder-avatar.png"}
            alt="profile"
            className="profile-avatar-xl"
          />
          <div className="info">
            <h2>{profile.name}</h2>
            <p className="muted">
              {profile.university?.name || "No University"} •{" "}
              {profile.department || "No Department"}
            </p>
            <p className="bio">{profile.bio || "No bio yet."}</p>
            {user?.id === profile.id && (
              <button className="btn-outline" onClick={() => setEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Clubs */}
      <section className="joined-clubs">
        <h3>Joined Clubs</h3>
        {profile.clubs && profile.clubs.length > 0 ? (
          <div className="club-list">
            {profile.clubs.map((c) => (
              <div key={c.id} className="club-item">
                <img
                  src={c.imageUrl || "/club-placeholder.png"}
                  alt={c.name}
                />
                <div>
                  <h4>{c.name}</h4>
                  <span className="muted">{c.university?.name}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">No clubs joined.</p>
        )}
      </section>

      {/* Posts */}
      <section className="user-posts">
        <h3>Posts by {profile.name}</h3>
        {posts.length > 0 ? (
          posts.map((p) => <PostCard key={p.id} post={p} />)
        ) : (
          <p className="muted">No posts yet.</p>
        )}
      </section>

      {/* ✅ Edit Profile Modal */}
      {editing && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <h3>Edit Profile</h3>
            <form onSubmit={handleUpdate}>
              <label>Profile Picture</label>
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

              <label>Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              ></textarea>

              <div className="modal-actions">
                <button type="button" onClick={() => setEditing(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
