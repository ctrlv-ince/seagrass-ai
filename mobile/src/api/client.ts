/**
 * Axios HTTP client configured for the Seagrass API.
 * Shared between all mobile API modules.
 */
import axios from "axios";

const apiClient = axios.create({
  baseURL:
    process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30_000,
});

export default apiClient;
