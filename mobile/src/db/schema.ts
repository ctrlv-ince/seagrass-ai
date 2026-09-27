/**
 * SQLite schema definitions for offline-first data storage.
 */

/**
 * SQL statements to create the local SQLite schema.
 * Execute these on app first launch or database upgrade.
 */
export const CREATE_TABLES_SQL = [
  `CREATE TABLE IF NOT EXISTS surveys (
    local_id TEXT PRIMARY KEY,
    remote_id TEXT,
    title TEXT NOT NULL,
    description TEXT,
    surveyor_name TEXT,
    location_name TEXT,
    latitude REAL,
    longitude REAL,
    status TEXT DEFAULT 'draft',
    sync_status TEXT DEFAULT 'pending',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS survey_images (
    local_id TEXT PRIMARY KEY,
    survey_local_id TEXT NOT NULL,
    remote_id TEXT,
    file_uri TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    sync_status TEXT DEFAULT 'pending',
    captured_at TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (survey_local_id) REFERENCES surveys(local_id)
  )`,

  `CREATE INDEX IF NOT EXISTS idx_images_survey
    ON survey_images(survey_local_id)`,

  `CREATE INDEX IF NOT EXISTS idx_surveys_sync
    ON surveys(sync_status)`,
] as const;
