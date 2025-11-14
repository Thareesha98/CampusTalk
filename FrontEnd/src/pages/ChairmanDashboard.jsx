// src/pages/ChairmanDashboard.jsx
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ChairmanSidebar from "../components/ChairmanSidebar";
import ClubProfileEditor from "../components/ClubProfileEditor";
import ClubMembersManager from "../components/ClubMembersManager";
import ClubPostsManager from "../components/ClubPostsManager";
import ClubEventsManager from "../components/ClubEventsManager";
import ClubStats from "../components/ClubStats";
import api from "../api";
import "./ChairmanDashboard.css";

export default function ChairmanDashboard() {
  const { user } = useContext(AuthContext);
  const [club, setClub] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "CHAIRMAN") {
      api
        .get(`/clubs?universityId=${user.university?.id}`)
        .then((res) => {
          const chairmanClub = res.data.find(
            (c) => c.chairman?.id === user.id
          );
          setClub(chairmanClub || null);
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <div className="dashboard-center">Loading...</div>;

  if (!club)
    return (
      <div className="dashboard-center">
        <h3>No club assigned to you yet.</h3>
        <p>Please contact an administrator.</p>
      </div>
    );

  return (
    <div className="chairman-dashboard">
      <ChairmanSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="dashboard-content">
        {activeTab === "profile" && <ClubProfileEditor club={club} setClub={setClub} />}
        {activeTab === "members" && <ClubMembersManager clubId={club.id} />}
        {activeTab === "posts" && <ClubPostsManager clubId={club.id} />}
        {activeTab === "events" && <ClubEventsManager clubId={club.id} />}
        {activeTab === "stats" && <ClubStats clubId={club.id} />}
      </div>
    </div>
  );
}
