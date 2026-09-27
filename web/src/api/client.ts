/**
 * Axios HTTP client configured for the Seagrass API.
 */
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30_000,
});

// Request interceptor — add auth token when available
apiClient.interceptors.request.use((config) => {
  // TODO: Add auth token from auth store
  return config;
});

// Response interceptor — centralized error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: Handle 401 (redirect to login), 5xx (toast notification)
    return Promise.reject(error);
  }
);

export default apiClient;
