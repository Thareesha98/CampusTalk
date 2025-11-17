// src/api.js
import axios from "axios";
import { globalLogout } from "./context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL + "/api";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// attach token if present
const token = localStorage.getItem("token");
if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

let isRefreshing = false;
let subscribers = [];

function onRefreshed(newToken) {
  subscribers.forEach((cb) => cb(newToken));
  subscribers = [];
}
function addSubscriber(cb) {
  subscribers.push(cb);
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalReq = err.config;

    // If no response (network) just reject; do not try to refresh
    if (!err.response) {
      return Promise.reject(err);
    }

    if (
      err.response.status === 401 &&
      !originalReq._retry &&
      !originalReq.url.endsWith("/auth/login") &&
      !originalReq.url.endsWith("/auth/register") &&
      !originalReq.url.endsWith("/auth/refresh-token")
    ) {
      originalReq._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addSubscriber((newToken) => {
            if (!newToken) return reject(err);
            originalReq.headers["Authorization"] = `Bearer ${newToken}`;
            resolve(api(originalReq));
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const refreshRes = await axios.post(
          `${API_BASE}/auth/refresh-token`,
          { refreshToken },
          { withCredentials: true }
        );

        const newToken = refreshRes.data.accessToken;
        if (!newToken) throw new Error("No access token in refresh response");

        localStorage.setItem("token", newToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        originalReq.headers["Authorization"] = `Bearer ${newToken}`;

        onRefreshed(newToken);

        return api(originalReq);
      } catch (refreshErr) {
        // Refresh failed -> force logout via globalLogout
        try {
          if (typeof globalLogout === "function") {
            globalLogout();
          } else {
            // fallback: clear tokens & redirect
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            delete api.defaults.headers.common["Authorization"];
            window.location.href = "/login";
          }
        } catch (ee) {
          // ignore
        }

        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;
