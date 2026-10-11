import { useState, useEffect, useCallback } from "react";
import apiClient from "../api/client";

/**
 * Hook to monitor network and backend connectivity.
 * Tests general internet connectivity first, then checks backend availability.
 */
export function useNetworkStatus(pingIntervalMs = 20_000) {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const checkConnection = useCallback(async () => {
    setIsChecking(true);
    let onlineDetected = false;

    // 1. Check real internet connectivity via public lightweight ping
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      // Lightweight public ping (Google 204 or Cloudflare trace)
      const res = await fetch("https://clients3.google.com/generate_204", {
        method: "HEAD",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.status >= 200 && res.status < 400) {
        onlineDetected = true;
      }
    } catch {
      // Fallback: try secondary reliable endpoint
      try {
        const res2 = await fetch("https://www.cloudflare.com/cdn-cgi/trace", {
          method: "HEAD",
        });
        if (res2.ok) onlineDetected = true;
      } catch {
        // Continue to backend check
      }
    }

    // 2. Check local/cloud FastAPI backend health
    try {
      await apiClient.get("/health", { timeout: 3000 });
      setIsBackendOnline(true);
      onlineDetected = true;
    } catch {
      setIsBackendOnline(false);
    }

    setIsOnline(onlineDetected);
    setIsChecking(false);
    return onlineDetected;
  }, []);

  useEffect(() => {
    checkConnection();
    const timer = setInterval(() => {
      checkConnection();
    }, pingIntervalMs);

    return () => clearInterval(timer);
  }, [checkConnection, pingIntervalMs]);

  return {
    isOnline,
    isBackendOnline,
    isChecking,
    checkConnection,
  };
}
