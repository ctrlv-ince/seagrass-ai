import { useState, useEffect, useCallback } from "react";
import apiClient from "../api/client";
import {
  getPendingSurveys,
  getPendingImages,
  markSurveySynced,
  markImageSynced,
  getLocalSurveyById,
} from "../db/repository";

export interface SyncState {
  isSyncing: boolean;
  pendingCount: number;
  lastSyncAt: Date | null;
  triggerSync: () => Promise<void>;
  refreshPendingCount: () => Promise<number>;
}

export function useOfflineSync(): SyncState {
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [lastSyncAt, setLastSyncAt] = useState<Date | null>(null);

  const refreshPendingCount = useCallback(async () => {
    try {
      const [surveys, images] = await Promise.all([
        getPendingSurveys(),
        getPendingImages(),
      ]);
      const total = surveys.length + images.length;
      setPendingCount(total);
      return total;
    } catch {
      return 0;
    }
  }, []);

  const triggerSync = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);

    try {
      // 1. Sync pending surveys first
      const pendingSurveys = await getPendingSurveys();
      for (const survey of pendingSurveys) {
        try {
          const res = await apiClient.post("/surveys/", {
            title: survey.title,
            description: survey.description || undefined,
            surveyor_name: survey.surveyor_name || undefined,
            location_name: survey.location_name || undefined,
            center_latitude: survey.latitude ?? undefined,
            center_longitude: survey.longitude ?? undefined,
          });

          if (res.data?.id) {
            await markSurveySynced(survey.local_id, res.data.id);
          }
        } catch (err: any) {
          console.warn(`Failed to sync survey ${survey.local_id}:`, err?.message);
        }
      }

      // 2. Sync pending images
      const pendingImages = await getPendingImages();
      for (const img of pendingImages) {
        try {
          // Check if parent survey has a remote ID
          const parentSurvey = await getLocalSurveyById(img.survey_local_id);
          const remoteSurveyId = parentSurvey?.remote_id;

          if (!remoteSurveyId) {
            continue; // Will sync on next pass once parent is synced
          }

          // Build multipart form data for image upload
          const formData = new FormData();
          const filename = img.file_uri.split("/").pop() || "quadrat.jpg";

          // On React Native, file objects in FormData take the shape: { uri, name, type }
          formData.append("file", {
            uri: img.file_uri,
            name: filename,
            type: "image/jpeg",
          } as any);

          if (img.latitude) formData.append("latitude", img.latitude.toString());
          if (img.longitude) formData.append("longitude", img.longitude.toString());

          const res = await apiClient.post(
            `/surveys/${remoteSurveyId}/images`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          if (res.data?.id) {
            await markImageSynced(img.local_id, res.data.id);
          }
        } catch (err: any) {
          console.warn(`Failed to sync image ${img.local_id}:`, err?.message);
        }
      }

      setLastSyncAt(new Date());
    } finally {
      await refreshPendingCount();
      setIsSyncing(false);
    }
  }, [isSyncing, refreshPendingCount]);

  // Initial count check and sync attempt on mount
  useEffect(() => {
    refreshPendingCount().then((count) => {
      if (count > 0) {
        triggerSync().catch(() => {});
      }
    });
  }, [refreshPendingCount, triggerSync]);

  return {
    isSyncing,
    pendingCount,
    lastSyncAt,
    triggerSync,
    refreshPendingCount,
  };
}
