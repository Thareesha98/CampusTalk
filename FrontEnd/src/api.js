// src/api.js
import axios from "axios";


const API_BASE = import.meta.env.VITE_API_BASE_URL + "/api";


const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Attach token if present
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
    if (
      err.response &&
      err.response.status === 401 &&
      !originalReq._retry &&
      !originalReq.url.endsWith("/auth/login") &&
      !originalReq.url.endsWith("/auth/register")
    ) {
      originalReq._retry = true;
      if (isRefreshing) {
        return new Promise((resolve) => {
          addSubscriber((token) => {
            originalReq.headers["Authorization"] = `Bearer ${token}`;
            resolve(axios(originalReq));
          });
        });
      }
      isRefreshing = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const refreshRes = await axios.post(
          `${API_BASE}/auth/refresh-token`,
          { refreshToken },
          { withCredentials: true }
        );

        const newToken = refreshRes.data.accessToken;
        localStorage.setItem("token", newToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        originalReq.headers["Authorization"] = `Bearer ${newToken}`;
        onRefreshed(newToken);
        return axios(originalReq);
      } catch (e) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        delete api.defaults.headers.common["Authorization"];
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  }
);

export default api;
