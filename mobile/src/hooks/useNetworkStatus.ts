import { useState, useEffect, useCallback } from "react";
import apiClient from "../api/client";

/**
 * Hook to monitor network connectivity in the field.
 * Periodically pings the FastAPI /health endpoint to verify real end-to-end connectivity.
 */
export function useNetworkStatus(pingIntervalMs = 15_000) {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const checkConnection = useCallback(async () => {
    setIsChecking(true);
    try {
      // Fast lightweight ping with 3s timeout
      await apiClient.get("/health", { timeout: 3500 });
      setIsOnline(true);
      return true;
    } catch {
      setIsOnline(false);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    // Initial check
    checkConnection();

    // Periodic heartbeat check
    const timer = setInterval(() => {
      checkConnection();
    }, pingIntervalMs);

    return () => clearInterval(timer);
  }, [checkConnection, pingIntervalMs]);

  return {
    isOnline,
    isChecking,
    checkConnection,
  };
}
