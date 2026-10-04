/**
 * Detection (YOLOv11 & Heuristic Dual-Mode) API hooks and types.
 */
import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "./client";

export interface DetectionBox {
  id: number;
  class_name: string;
  common_name: string;
  confidence: number;
  bbox: {
    x_min: number;
    y_min: number;
    x_max: number;
    y_max: number;
    pixel_box: [number, number, number, number];
  };
}

export interface DecayCurvePoint {
  distance_m: number;
  wave_height_m: number;
  energy_decay_pct?: number;
  energy_remaining_pct?: number;
}

export interface DetectionResult {
  status: string;
  model_mode: string;
  model_ready: boolean;
  image_id?: string | null;
  image_url?: string | null;
  image_dimensions?: {
    width: number;
    height: number;
  };
  specifications: {
    primary_species: string;
    common_name: string;
    coverage_percent: number;
    blade_length_cm: number;
    blade_width_cm: number;
    shoot_density_m2: number;
    confidence: number;
  };
  detections: DetectionBox[];
  wave_attenuation: {
    wave_energy_damping_pct: number;
    wave_height_reduction_pct: number;
    transmitted_wave_height_m: number;
    incident_wave_height_m: number;
    confidence_lower?: number;
    confidence_upper?: number;
    damping_coefficient_kd?: number;
    decay_curve: DecayCurvePoint[];
  };
  environmental_conditions?: {
    water_depth_m: number;
    meadow_width_m: number;
    wave_period_s: number;
  };
}

export interface SpeciesItem {
  id: string;
  scientific_name: string;
  common_name: string | null;
  description: string | null;
}

// ── Mutation hooks ───────────────────────────────────────────

export function useAnalyzeImage() {
  return useMutation({
    mutationFn: async (params: {
      file: File;
      waterDepthM?: number;
      waveHeightM?: number;
      wavePeriodS?: number;
      meadowWidthM?: number;
      surveyId?: string;
    }): Promise<DetectionResult> => {
      const formData = new FormData();
      formData.append("file", params.file);

      const queryParams = new URLSearchParams();
      if (params.waterDepthM) queryParams.set("water_depth_m", params.waterDepthM.toString());
      if (params.waveHeightM) queryParams.set("incident_wave_height_m", params.waveHeightM.toString());
      if (params.wavePeriodS) queryParams.set("wave_period_s", params.wavePeriodS.toString());
      if (params.meadowWidthM) queryParams.set("meadow_width_m", params.meadowWidthM.toString());
      if (params.surveyId) queryParams.set("survey_id", params.surveyId);

      const url = `/detections/analyze?${queryParams.toString()}`;
      const { data } = await apiClient.post<DetectionResult>(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 45_000,
      });
      return data;
    },
  });
}

export function useSpeciesList() {
  return useQuery({
    queryKey: ["species"],
    queryFn: async (): Promise<SpeciesItem[]> => {
      const { data } = await apiClient.get<SpeciesItem[]>("/detections/species");
      return data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
