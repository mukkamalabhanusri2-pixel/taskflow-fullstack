/**
 * API Service
 * Clean Axios instance with safe auth handling (FIXED)
 */

import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// ============================================================
// Axios instance
// ============================================================
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ============================================================
// Request Interceptor - Attach JWT token
// ============================================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("taskflow_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================
// Response Interceptor - SAFE 401 handling (NO LOOP)
// ============================================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message || "Something went wrong";

    // ========================================================
    // Handle 401 ONLY ONCE per session
    // ========================================================
    if (status === 401) {
      const url = error.config?.url || "";

      const isAuthRoute =
        url.includes("/auth/login") ||
        url.includes("/auth/register");

      if (!isAuthRoute) {
        // 🔴 Prevent multiple triggers in same session
        const alreadyHandled = sessionStorage.getItem(
          "auth_401_handled"
        );

        if (!alreadyHandled) {
          sessionStorage.setItem("auth_401_handled", "true");

          // Clear auth ONLY
          localStorage.removeItem("taskflow_token");
          localStorage.removeItem("taskflow_user");

          // Redirect safely (no toast, no loops)
          window.location.replace("/login");

          // Reset flag after redirect cycle
          setTimeout(() => {
            sessionStorage.removeItem("auth_401_handled");
          }, 3000);
        }
      }
    }

    return Promise.reject({
      message,
      status,
    });
  }
);

// ============================================================
// Auth API
// ============================================================
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
  changePassword: (data) => api.put("/auth/change-password", data),
};

// ============================================================
// Tasks API
// ============================================================
export const tasksAPI = {
  getAll: (params) => api.get("/tasks", { params }),
  getOne: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post("/tasks", data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  getStats: () => api.get("/tasks/stats"),
  bulkUpdate: (data) => api.patch("/tasks/bulk-update", data),
};

export default api;