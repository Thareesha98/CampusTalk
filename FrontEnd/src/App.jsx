// src/App/App.jsx
import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Universities from "./pages/Universities/Universities";
import Clubs from "./pages/Clubs/Clubs";
import Events from "./pages/Events/Events";
import Notifications from "./pages/Notifications";
import Search from "./pages/Search";
import { AuthContext } from "./context/AuthContext";
import "./App.css";

import DashboardLayout from "./pages/DashboardLayout";
import ClubPublicPage from "./pages/ClubPublicPage";
import HomeFeed from "./pages/HomeFeed";
import CreateClub from "./pages/CreateClub";



/* PrivateRoute wrapper */
function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="center auth-loading">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
   const { user } = useContext(AuthContext); 
  return (
    <div className="app-root">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile/:id" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/universities" element={<PrivateRoute><Universities /></PrivateRoute>} />
          <Route path="/clubs" element={<PrivateRoute><Clubs /></PrivateRoute>} />
          <Route path="/events" element={<PrivateRoute><Events /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
          <Route path="/search" element={<PrivateRoute><Search /></PrivateRoute>} />
          {/* fallback */}
          <Route path="*" element={<div className="center">404 — Page not found</div>} />
          <Route path="/dashboard/club/:id" element={<DashboardLayout />} />
          <Route path="/clubs/:id" element={<ClubPublicPage />} />
          <Route path="/" element={<HomeFeed />} />

          {user?.role === "CHAIRMAN" || user?.role === "ADMIN" ? (
          <Route path="/clubs/new" element={<CreateClub />} />
        ) : null}

        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        />


        </Routes>
      </main>
    </div>
  );
}
