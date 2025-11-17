// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../api";

export const AuthContext = createContext();

// allow axios to call this when refresh fails
export let globalLogout = () => {};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [loadingAuth, setLoadingAuth] = useState(true); // indicate token validation in progress

  // Validate token on app start
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoadingAuth(false);
        return;
      }

      // attach token to api defaults (just in case)
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        // validate token by fetching profile
        const res = await api.get("/users/profile");
        // if success, ensure local user is fresh
        const finalUser = { ...res.data, accessToken: token, refreshToken: localStorage.getItem("refreshToken") };
        localStorage.setItem("user", JSON.stringify(finalUser));
        setUser(finalUser);
      } catch (err) {
        // if unauthorized or forbidden -> logout immediately
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          // force logout
          logoutImmediate();
        } else {
          // network error or backend down: keep local state but don't auto-logout
          // clear user to be safe if we couldn't validate
          // optional: keep user null to force login UI; here we'll clear to be safe
          setUser(null);
          localStorage.removeItem("user");
        }
      } finally {
        setLoadingAuth(false);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // LOGIN
  const login = async ({ email, password }) => {
    try {
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
    } catch (err) {
      throw err;
    }
  };

  // internal immediate logout used during init validation to avoid stale state
  const logoutImmediate = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    // redirect to login
    window.location.href = "/login";
  };

  // LOGOUT (exposed)
  const logout = () => {
    logoutImmediate();
  };

  // expose globalLogout for axios
  globalLogout = logoutImmediate;

  const updateUserProfile = (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  // while token validation is in progress, we can render a loader or nothing.
  // Expose loadingAuth so App or routes can wait if desired.
  return (
    <AuthContext.Provider
      value={{ user, login, logout, updateUserProfile, loadingAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};
