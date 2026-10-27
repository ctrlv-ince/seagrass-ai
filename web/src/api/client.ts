/**
 * Axios HTTP client configured for the Seagrass API.
 */
import axios from "axios";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30_000,
});

// Request interceptor — attach Supabase session token or demo token
apiClient.interceptors.request.use(async (config) => {
  try {
    if (isSupabaseConfigured) {
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      // In demo mode, supply demo token
      const stored = localStorage.getItem("seagrass_demo_user");
      let token = "demo-admin";
      if (stored) {
        try {
          const user = JSON.parse(stored);
          const role = user?.user_metadata?.role || "admin";
          token = `demo-${user.id || "admin"}-${role}`;
        } catch {
          token = "demo-admin";
        }
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.warn("Failed to set auth header on API request:", err);
  }
  return config;
});

// Response interceptor — centralized error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
