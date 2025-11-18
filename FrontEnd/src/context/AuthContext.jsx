// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../api";
import { Client } from "@stomp/stompjs";

export const AuthContext = createContext();

// Used by axios interceptor
export let globalLogout = () => {};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [stompClient, setStompClient] = useState(null);

  // ----------------------------------------------------------
  // 🔔 Show on-screen popup notification
  // ----------------------------------------------------------
  const showNotificationPopup = (notif) => {
    const div = document.createElement("div");

    div.innerHTML = `
      <div style="
        position: fixed;
        right: 20px;
        top: 20px;
        background: rgba(14,165,233,0.95);
        color: white;
        padding: 16px 18px;
        border-radius: 12px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        z-index: 9999;
        font-family: Poppins, sans-serif;
        animation: fadeIn 0.3s ease;
        max-width: 280px;
      ">
        <strong style="font-size: 1.05rem;">${notif.title}</strong><br/>
        <span style="opacity: .9">${notif.message}</span>
      </div>
    `;

    document.body.appendChild(div);
    setTimeout(() => div.remove(), 5000);
  };

  // ----------------------------------------------------------
  // 🔌 WebSocket (Pure WebSocket — NO SOCKJS)
  // ----------------------------------------------------------
  useEffect(() => {
    if (!user) return;

    const client = new Client({
      brokerURL: "ws://localhost:8081/ws", // native WebSocket endpoint
      reconnectDelay: 4000,
      debug: () => {},
    });

    client.onConnect = () => {
      console.log("🔗 WebSocket connected!");

      client.subscribe(`/queue/notifications-${user.id}`, (msg) => {
        const notif = JSON.parse(msg.body);

        showNotificationPopup(notif);

        // notify Notification page & Navbar
        window.dispatchEvent(new CustomEvent("new-notification"));
      });
    };

    client.onStompError = (frame) => {
      console.error("❌ STOMP Error", frame);
    };

    client.activate();
    setStompClient(client);

    return () => client.deactivate();
  }, [user]);

  // ----------------------------------------------------------
  // 🔐 Token validation on load
  // ----------------------------------------------------------
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoadingAuth(false);
        return;
      }

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const res = await api.get("/users/profile");

        const finalUser = {
          ...res.data,
          accessToken: token,
          refreshToken: localStorage.getItem("refreshToken"),
        };

        localStorage.setItem("user", JSON.stringify(finalUser));
        setUser(finalUser);
      } catch (err) {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          logoutImmediate();
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
      } finally {
        setLoadingAuth(false);
      }
    };

    init();
  }, []);

  // ----------------------------------------------------------
  // 🔑 LOGIN
  // ----------------------------------------------------------
  const login = async ({ email, password }) => {
    const res = await api.post("/auth/login", { email, password });
    const data = res.data;

    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    api.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;

    const profileRes = await api.get("/users/profile");

    const finalUser = {
      ...profileRes.data,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };

    localStorage.setItem("user", JSON.stringify(finalUser));
    setUser(finalUser);
  };

  // ----------------------------------------------------------
  // 🚪 LOGOUT
  // ----------------------------------------------------------
  const logoutImmediate = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    window.location.href = "/login";
  };

  const logout = () => logoutImmediate();

  globalLogout = logoutImmediate;

  // ----------------------------------------------------------
  // ✏️ Update local user profile
  // ----------------------------------------------------------
  const updateUserProfile = (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, updateUserProfile, loadingAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};
