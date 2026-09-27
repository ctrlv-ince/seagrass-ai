/**
 * Offline sync hook — manages syncing local SQLite data with the remote API.
 *
 * Watches network connectivity and triggers sync when online.
 */

export function useOfflineSync() {
  // TODO: Implement offline sync logic
  // - Monitor NetInfo connectivity changes
  // - On reconnect, push pending surveys/images to API
  // - Update sync_status in local SQLite
  // - Return { isSyncing, pendingCount, lastSyncAt }
  return {
    isSyncing: false,
    pendingCount: 0,
    lastSyncAt: null,
  };
}
