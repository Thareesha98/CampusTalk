import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api";
import "./Navbar.css";

/*
  Navbar features:
   - Brand (CampusTalk)
   - Search bar
   - Navigation links
   - Notifications bell
   - Profile menu
   - Dashboard shortcut for Chairmen/Admins
*/

export default function Navbar({ onSearch }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [myClub, setMyClub] = useState(null); // 🆕 store chairman’s club
  const menuRef = useRef(null);

  // 🔍 Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      if (onSearch) onSearch(q);
    }, 300);
    return () => clearTimeout(t);
  }, [q, onSearch]);

  // 🔔 Fetch notifications (placeholder)
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch("/api/notifications", { credentials: "include" });
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          setNotifications(data || []);
          setUnreadCount((data || []).filter((n) => !n.read).length);
        }
      } catch {
        // ignore
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // 🧩 NEW: Fetch chairman’s club (if applicable)
  useEffect(() => {
    async function fetchMyClub() {
      if (user?.role === "CHAIRMAN") {
        try {
          const res = await api.get(`/clubs/chairman/${user.id}`);
          setMyClub(res.data);
        } catch (err) {
          setMyClub(null);
        }
      }
    }
    fetchMyClub();
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function onDoc(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="ct-navbar" role="banner">
      <div className="ct-nav-inner">
        {/* Left section */}
        <div className="brand-area">
          <Link to="/" className="ct-brand" aria-label="CampusTalk home">
            <span className="mark" aria-hidden="true" />
            <span className="brand-text">
              Campus<span>Talk</span>
            </span>
          </Link>

          <div className="search-wrap" role="search">
            <svg className="icon search-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 21l-4.35-4.35"></path>
              <circle cx="11" cy="11" r="6"></circle>
            </svg>
            <input
              className="ct-search"
              placeholder="Search people, clubs, posts or events"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search"
            />
            {q && (
              <button className="clear-btn" onClick={() => setQ("")} aria-label="Clear search">
                ✕
              </button>
            )}
          </div>

          <button
            className="mobile-toggle"
            aria-label="Toggle navigation"
            aria-expanded={showMobileNav}
            onClick={() => setShowMobileNav((s) => !s)}
          >
            <span className="hamburger" />
          </button>
        </div>

        {/* Center links */}
        <nav className={`ct-links ${showMobileNav ? "open" : ""}`} aria-label="Primary">
          <Link to="/" className="ct-link">
            Home
          </Link>
          <Link to="/universities" className="ct-link">
            Universities
          </Link>
          <Link to="/clubs" className="ct-link">
            Clubs
          </Link>
          <Link to="/events" className="ct-link">
            Events
          </Link>

          {/* 🧩 Add Manage Dashboard Link (Chairman/Admin only) */}
          {(user?.role === "CHAIRMAN" && myClub) || user?.role === "ADMIN" ? (
            <Link
              to={
                user?.role === "CHAIRMAN"
                  ? `/dashboard/club/${myClub?.id}`
                  : "/admin/dashboard"
              }
              className="ct-link btn-dashboard"
            >
              🎛 Manage Club
            </Link>
          ) : null}
        </nav>

        {/* Right section */}
        <div className="ct-actions">
          <button
            className="icon-btn"
            title="Notifications"
            aria-label={`Notifications, ${unreadCount} unread`}
            onClick={() => navigate("/notifications")}
          >
            <svg className="icon bell" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2C9.243 2 7 4.243 7 7v3.086A2 2 0 0 0 6 12v1l-1 1v1h14v-1l-1-1v-1a2 2 0 0 0-1-1.914V7c0-2.757-2.243-5-5-5z"></path>
            </svg>
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </button>

          {user ? (
            <div className="profile-area" ref={menuRef}>
              <button
                className="profile-btn"
                aria-haspopup="true"
                aria-expanded={showMenu}
                onClick={() => setShowMenu((s) => !s)}
              >
                <img
                  src={user.profilePicUrl || "/placeholder-avatar.png"}
                  alt={`${user.name} avatar`}
                />
                <span className="username-hidden">{user.name}</span>
                <svg className="icon caret" viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {showMenu && (
                <div className="profile-menu" role="menu">
                  <Link to={`/profile/${user.id}`} className="menu-item">
                    View profile
                  </Link>
                  <Link to="/settings" className="menu-item">
                    Settings
                  </Link>
                  <button className="menu-item danger" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-actions">
              <Link className="btn-outline" to="/login">
                Sign in
              </Link>
              <Link className="btn-primary" to="/register">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
