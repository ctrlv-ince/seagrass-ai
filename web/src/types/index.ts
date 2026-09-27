/**
 * Shared TypeScript types for the Seagrass web app.
 *
 * Prefer Zod schemas in api/ modules as the source of truth,
 * then infer types with z.infer<>. Use this file only for
 * types that don't originate from API responses.
 */

// ── Map / GIS ────────────────────────────────────────────────

export type LatLng = {
  latitude: number;
  longitude: number;
};

export type BoundingBox = {
  north: number;
  south: number;
  east: number;
  west: number;
};

// ── Detection ────────────────────────────────────────────────

export type BBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Detection = {
  class_name: string;
  confidence: number;
  bbox: BBox;
};

// ── UI State ─────────────────────────────────────────────────

export type PageStatus = "idle" | "loading" | "error" | "success";
