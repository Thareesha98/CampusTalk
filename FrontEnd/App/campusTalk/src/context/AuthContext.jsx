import React, { createContext, useState, useEffect } from "react";
import api from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // ✅ Auto-attach token to API on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  // ✅ Login and fetch full user profile
  const login = async ({ email, password }) => {
    try {
      // Step 1: Login and get tokens
      const res = await api.post("/auth/login", { email, password });
      const data = res.data;

      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.accessToken}`;

      // Step 2: Fetch full user profile
      const profileRes = await api.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      });

      const fullUser = profileRes.data;

      // Step 3: Merge tokens + user info
      const finalUser = {
        ...fullUser,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };

      // Step 4: Save and update context
      localStorage.setItem("user", JSON.stringify(finalUser));
      setUser(finalUser);
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      throw err;
    }
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  // ✅ Update profile info globally (e.g., after editing)
  const updateUserProfile = (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
