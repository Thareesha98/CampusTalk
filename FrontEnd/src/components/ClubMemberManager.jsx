// src/components/ClubMembersManager.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import "./ClubMembersManager.css";

export default function ClubMembersManager({ clubId }) {
  const [members, setMembers] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Fetch members + pending
  useEffect(() => {
    async function loadMembers() {
      try {
        const res = await api.get(`/clubs/${clubId}/members`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const all = res.data || [];
        setMembers(all.filter((m) => m.status === "APPROVED"));
        setPending(all.filter((m) => m.status === "PENDING"));
      } catch (err) {
        console.error("Failed to fetch members:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMembers();
  }, [clubId, token]);

  // Approve join request
  const handleApprove = async (memberId) => {
    try {
      await api.post(
        `/clubs/${clubId}/approve/${memberId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPending(pending.filter((m) => m.id !== memberId));
      alert("✅ Member approved!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to approve member");
    }
  };

  // Reject join request
  const handleReject = async (memberId) => {
    try {
      await api.post(
        `/clubs/${clubId}/reject/${memberId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPending(pending.filter((m) => m.id !== memberId));
      alert("🚫 Member rejected!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to reject member");
    }
  };

  // Remove approved member
  const handleRemove = async (memberId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;

    try {
      await api.delete(`/clubs/${clubId}/members/${memberId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(members.filter((m) => m.id !== memberId));
      alert("🗑 Member removed!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to remove member");
    }
  };

  if (loading) return <p>Loading members...</p>;

  return (
    <div className="club-members-manager">
      <h3>Club Members</h3>

      {/* Pending Requests */}
      {pending.length > 0 && (
        <section className="pending-requests">
          <h4>Pending Requests ({pending.length})</h4>
          {pending.map((m) => (
            <div key={m.id} className="member-card pending">
              <img src={m.profilePicUrl || "/placeholder-avatar.png"} alt={m.name} />
              <div className="info">
                <strong>{m.name}</strong>
                <span>{m.email}</span>
              </div>
              <div className="actions">
                <button className="approve" onClick={() => handleApprove(m.id)}>
                  Approve
                </button>
                <button className="reject" onClick={() => handleReject(m.id)}>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Approved Members */}
      <section className="approved-members">
        <h4>Approved Members ({members.length})</h4>
        {members.length === 0 ? (
          <p>No approved members yet.</p>
        ) : (
          members.map((m) => (
            <div key={m.id} className="member-card">
              <img src={m.profilePicUrl || "/placeholder-avatar.png"} alt={m.name} />
              <div className="info">
                <strong>{m.name}</strong>
                <span>{m.email}</span>
              </div>
              <button className="remove" onClick={() => handleRemove(m.id)}>
                Remove
              </button>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
