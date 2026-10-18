/**
 * Seagrass AI — Shared Cross-Platform Domain Types
 * Single source of truth for Web, Mobile, and Edge telemetry.
 */

// ── Geographic & Coordinate Types ─────────────────────────────

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

// ── Computer Vision & Detection Types ─────────────────────────

export interface BBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Detection {
  class_name: string;
  confidence: number;
  bbox: BBox;
}

export interface SpeciesTaxa {
  id: string;
  scientificName: string;
  commonName: string;
  family: string;
  conservationStatus?: string;
  typicalBladeLengthCm: number;
  typicalShootDensityPerM2: number;
  roughnessCoefficient: number;
  dampingCapacity: "low" | "moderate" | "high" | "very_high";
}

// ── Meadow Biometrics & Quadrat Sampling ──────────────────────

export interface QuadratSample {
  quadratId: string;
  transectMeters: number;
  coveragePercent: number;
  canopyHeightCm: number;
  shootDensityM2: number;
  identifiedSpecies: string;
  confidence: number;
}

// ── Hydrodynamic & Wave Physics Types ─────────────────────────

export interface WaveAttenuationParams {
  incidentWaveHeightM: number;
  waterDepthM: number;
  peakPeriodSeconds: number;
  transectLengthM: number;
  shootDensityM2: number;
  bladeLengthCm: number;
  dragCoefficient?: number;
}

export interface DecayCurvePoint {
  distance_m: number;
  wave_height_m: number;
  unvegetated_height_m: number;
  attenuation_pct: number;
}

export interface WaveAttenuationResult {
  incidentHeightM: number;
  transmittedHeightM: number;
  totalEnergyDissipationPct: number;
  dampingCoefficientK: number;
  inshoreHeightM: number;
  curve: DecayCurvePoint[];
}

// ── Survey & Data Sync Types ──────────────────────────────────

export type SurveyStatus = "draft" | "in_progress" | "completed" | "archived";
export type SyncStatus = "synced" | "pending" | "failed" | "conflict";

export interface SurveySummary {
  id: string;
  title: string;
  locationName: string;
  coordinates?: LatLng;
  status: SurveyStatus;
  syncStatus: SyncStatus;
  quadratCount: number;
  dominantSpecies?: string;
  meanCoveragePercent?: number;
  createdAt: string;
  updatedAt: string;
}
