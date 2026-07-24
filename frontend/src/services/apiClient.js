import axios from "axios";

const apiClient = axios.create({
  // In production, set VITE_API_URL (e.g. "/api") at build time.
  // Locally it falls back to the dev backend, so nothing changes for `npm run dev`.
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;