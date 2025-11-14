import React, { useContext } from "react";
import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ClubStats from "../components/ClubStats";
import RSVPManager from "../components/RSVPManager";
import ManageClubs from "../components/ManageClubs";
import "./DashboardLayout.css";

import ManagePosts from "../components/ManagePosts";
import ManageEvents from "../components/ManageEvents";

export default function DashboardLayout() {
  const { user } = useContext(AuthContext);

  if (!user || (user.role !== "CHAIRMAN" && user.role !== "ADMIN")) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="dashboard-container">
      {/* ───────────── Sidebar ───────────── */}
      <aside className="dashboard-sidebar">
        <h2>📊 Dashboard</h2>

        <nav>
          <NavLink
            to="/dashboard/manage-clubs"
            className={({ isActive }) =>
              isActive ? "active-link" : "sidebar-link"
            }
          >
            🏛 Manage Clubs
          </NavLink>

          <NavLink
            to="/dashboard/manage-posts"
            className={({ isActive }) =>
              isActive ? "active-link" : "sidebar-link"
            }
          >
            🗞 Manage Posts
          </NavLink>

          <NavLink
            to="/dashboard/manage-events"
            className={({ isActive }) =>
              isActive ? "active-link" : "sidebar-link"
            }
          >
            📅 Manage Events
          </NavLink>

          <NavLink
            to="/dashboard/rsvp-manager"
            className={({ isActive }) =>
              isActive ? "active-link" : "sidebar-link"
            }
          >
            👥 RSVPs
          </NavLink>

          <NavLink
            to="/dashboard/stats"
            className={({ isActive }) =>
              isActive ? "active-link" : "sidebar-link"
            }
          >
            📈 Stats
          </NavLink>
        </nav>
      </aside>

      {/* ───────────── Content Area ───────────── */}
      <section className="dashboard-content">
        <Routes>
          <Route path="/" element={<h2>Welcome, {user.name} 👋</h2>} />
          <Route path="manage-clubs" element={<ManageClubs />} />
          <Route path="manage-posts" element={<ManagePosts />} />
          <Route path="manage-events" element={<ManageEvents />} />
          <Route path="rsvp-manager" element={<RSVPManager />} />
          <Route path="stats" element={<ClubStats />} />
        </Routes>
      </section>
    </div>
  );
}
