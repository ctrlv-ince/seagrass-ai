/**
 * Shared TypeScript types for the Seagrass mobile app.
 *
 * API response types should be validated with Zod at the boundary
 * and inferred from schemas (same pattern as web/).
 */

export type LatLng = {
  latitude: number;
  longitude: number;
};

export type SyncStatus = "synced" | "pending" | "failed";

export type OfflineSurvey = {
  localId: string;
  remoteId?: string;
  title: string;
  description?: string;
  location?: LatLng;
  syncStatus: SyncStatus;
  createdAt: string;
  updatedAt: string;
};
