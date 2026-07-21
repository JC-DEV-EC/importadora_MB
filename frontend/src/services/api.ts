import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("mb_user");
    if (raw) {
      const user = JSON.parse(raw);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
  } catch {}
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("mb_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;