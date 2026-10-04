import { getDatabase } from "./database";

export interface LocalSurvey {
  local_id: string;
  remote_id: string | null;
  title: string;
  description: string | null;
  surveyor_name: string | null;
  location_name: string | null;
  latitude: number | null;
  longitude: number | null;
  status: string;
  sync_status: "pending" | "synced" | "error";
  created_at: string;
  updated_at: string;
}

export interface LocalSurveyImage {
  local_id: string;
  survey_local_id: string;
  remote_id: string | null;
  file_uri: string;
  latitude: number | null;
  longitude: number | null;
  sync_status: "pending" | "synced" | "error";
  captured_at: string | null;
  created_at: string;
}

export interface CreateSurveyInput {
  title: string;
  description?: string;
  surveyor_name?: string;
  location_name?: string;
  latitude?: number;
  longitude?: number;
}

export interface CreateSurveyImageInput {
  survey_local_id: string;
  file_uri: string;
  latitude?: number;
  longitude?: number;
  captured_at?: string;
}

function generateLocalId(): string {
  return "loc_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 7);
}

/**
 * Save a new field survey locally in SQLite.
 * Initial sync status is 'pending' so it will sync when network is available.
 */
export async function createLocalSurvey(input: CreateSurveyInput): Promise<LocalSurvey> {
  const db = await getDatabase();
  const local_id = generateLocalId();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO surveys (
      local_id, remote_id, title, description, surveyor_name,
      location_name, latitude, longitude, status, sync_status,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      local_id,
      null,
      input.title,
      input.description || null,
      input.surveyor_name || null,
      input.location_name || null,
      input.latitude || null,
      input.longitude || null,
      "draft",
      "pending",
      now,
      now,
    ]
  );

  return {
    local_id,
    remote_id: null,
    title: input.title,
    description: input.description || null,
    surveyor_name: input.surveyor_name || null,
    location_name: input.location_name || null,
    latitude: input.latitude || null,
    longitude: input.longitude || null,
    status: "draft",
    sync_status: "pending",
    created_at: now,
    updated_at: now,
  };
}

/**
 * Retrieve all surveys stored in the local SQLite database.
 */
export async function getLocalSurveys(): Promise<LocalSurvey[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync(`SELECT * FROM surveys ORDER BY created_at DESC`);
  return rows as LocalSurvey[];
}

/**
 * Retrieve a single survey by its local identifier.
 */
export async function getLocalSurveyById(localId: string): Promise<LocalSurvey | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync(`SELECT * FROM surveys WHERE local_id = ?`, [localId]);
  return (row as LocalSurvey) || null;
}

/**
 * Record a captured quadrat photo locally with pending sync state.
 */
export async function saveLocalSurveyImage(input: CreateSurveyImageInput): Promise<LocalSurveyImage> {
  const db = await getDatabase();
  const local_id = generateLocalId();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO survey_images (
      local_id, survey_local_id, remote_id, file_uri,
      latitude, longitude, sync_status, captured_at, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      local_id,
      input.survey_local_id,
      null,
      input.file_uri,
      input.latitude || null,
      input.longitude || null,
      "pending",
      input.captured_at || now,
      now,
    ]
  );

  return {
    local_id,
    survey_local_id: input.survey_local_id,
    remote_id: null,
    file_uri: input.file_uri,
    latitude: input.latitude || null,
    longitude: input.longitude || null,
    sync_status: "pending",
    captured_at: input.captured_at || now,
    created_at: now,
  };
}

/**
 * Retrieve images attached to a local survey.
 */
export async function getLocalSurveyImages(surveyLocalId: string): Promise<LocalSurveyImage[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync(
    `SELECT * FROM survey_images WHERE survey_local_id = ? ORDER BY created_at DESC`,
    [surveyLocalId]
  );
  return rows as LocalSurveyImage[];
}

/**
 * Get all surveys awaiting remote cloud sync.
 */
export async function getPendingSurveys(): Promise<LocalSurvey[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync(
    `SELECT * FROM surveys WHERE sync_status = 'pending' ORDER BY created_at ASC`
  );
  return rows as LocalSurvey[];
}

/**
 * Get all images awaiting remote cloud sync.
 */
export async function getPendingImages(): Promise<LocalSurveyImage[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync(
    `SELECT * FROM survey_images WHERE sync_status = 'pending' ORDER BY created_at ASC`
  );
  return rows as LocalSurveyImage[];
}

/**
 * Mark a local survey as successfully synced to the backend server.
 */
export async function markSurveySynced(localId: string, remoteId: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE surveys SET sync_status = 'synced', remote_id = ? WHERE local_id = ?`,
    [remoteId, localId]
  );
}

/**
 * Mark a local image as successfully synced to the backend server.
 */
export async function markImageSynced(localId: string, remoteId: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE survey_images SET sync_status = 'synced', remote_id = ? WHERE local_id = ?`,
    [remoteId, localId]
  );
}
