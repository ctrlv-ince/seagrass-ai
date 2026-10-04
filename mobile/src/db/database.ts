import { Platform } from "react-native";
import { CREATE_TABLES_SQL } from "./schema";

let dbInstance: any = null;
let initPromise: Promise<any> | null = null;

/**
 * Get or initialize the local SQLite database.
 * On native platforms (iOS/Android), uses expo-sqlite.
 * On web, gracefully falls back to memory/mock to prevent crashes.
 */
export async function getDatabase() {
  if (dbInstance) {
    return dbInstance;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    if (Platform.OS === "web") {
      // In-memory web fallback
      dbInstance = createWebDatabaseFallback();
      return dbInstance;
    }

    try {
      const SQLite = await import("expo-sqlite");
      const db = await SQLite.openDatabaseAsync("seagrass_field.db");

      // Execute table creation statements
      for (const sql of CREATE_TABLES_SQL) {
        await db.execAsync(sql);
      }

      dbInstance = db;
      return dbInstance;
    } catch (err) {
      console.warn("SQLite native initialization failed, using fallback:", err);
      dbInstance = createWebDatabaseFallback();
      return dbInstance;
    }
  })();

  return initPromise;
}

/**
 * Lightweight web/test fallback that mirrors SQLiteDatabase async methods
 * backed by localStorage or memory.
 */
function createWebDatabaseFallback() {
  const memoryStore: Record<string, any[]> = {
    surveys: [],
    survey_images: [],
  };

  return {
    async execAsync(_sql: string) {
      // No-op for DDL in mock
    },
    async runAsync(sql: string, ...params: any[]) {
      const flatParams = params.flat();
      const lower = sql.toLowerCase();

      if (lower.startsWith("insert into surveys")) {
        const [local_id, remote_id, title, description, surveyor_name, location_name, latitude, longitude, status, sync_status, created_at, updated_at] = flatParams;
        memoryStore.surveys.push({
          local_id,
          remote_id: remote_id || null,
          title,
          description: description || null,
          surveyor_name: surveyor_name || null,
          location_name: location_name || null,
          latitude: latitude || null,
          longitude: longitude || null,
          status: status || "draft",
          sync_status: sync_status || "pending",
          created_at,
          updated_at,
        });
      } else if (lower.startsWith("insert into survey_images")) {
        const [local_id, survey_local_id, remote_id, file_uri, latitude, longitude, sync_status, captured_at, created_at] = flatParams;
        memoryStore.survey_images.push({
          local_id,
          survey_local_id,
          remote_id: remote_id || null,
          file_uri,
          latitude: latitude || null,
          longitude: longitude || null,
          sync_status: sync_status || "pending",
          captured_at: captured_at || null,
          created_at,
        });
      } else if (lower.startsWith("update surveys set sync_status")) {
        const [sync_status, remote_id, local_id] = flatParams;
        const s = memoryStore.surveys.find((x) => x.local_id === local_id);
        if (s) {
          s.sync_status = sync_status;
          if (remote_id) s.remote_id = remote_id;
        }
      } else if (lower.startsWith("update survey_images set sync_status")) {
        const [sync_status, remote_id, local_id] = flatParams;
        const img = memoryStore.survey_images.find((x) => x.local_id === local_id);
        if (img) {
          img.sync_status = sync_status;
          if (remote_id) img.remote_id = remote_id;
        }
      }
      return { changes: 1, lastInsertRowId: 1 };
    },
    async getAllAsync(sql: string, ...params: any[]) {
      const flatParams = params.flat();
      const lower = sql.toLowerCase();

      if (lower.includes("from surveys") && lower.includes("sync_status = 'pending'")) {
        return memoryStore.surveys.filter((s) => s.sync_status === "pending");
      }
      if (lower.includes("from surveys") && lower.includes("where local_id =")) {
        const id = flatParams[0];
        return memoryStore.surveys.filter((s) => s.local_id === id);
      }
      if (lower.includes("from surveys")) {
        return [...memoryStore.surveys].reverse();
      }
      if (lower.includes("from survey_images") && lower.includes("sync_status = 'pending'")) {
        return memoryStore.survey_images.filter((img) => img.sync_status === "pending");
      }
      if (lower.includes("from survey_images") && lower.includes("where survey_local_id =")) {
        const surveyId = flatParams[0];
        return memoryStore.survey_images.filter((img) => img.survey_local_id === surveyId);
      }
      return [];
    },
    async getFirstAsync(sql: string, ...params: any[]) {
      const rows = await this.getAllAsync(sql, ...params);
      return rows[0] || null;
    },
  };
}
