/**
 * Wave attenuation prediction API client and types.
 */
import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "./client";

export interface DecayProfilePoint {
  distance_m: number;
  wave_height_m: number;
  energy_decay_pct: number;
}

export interface PredictionResponse {
  id: string;
  survey_id: string | null;
  model_version: string;
  seagrass_density: number;
  blade_length_cm: number;
  water_depth_m: number;
  wave_height_m: number;
  wave_period_s: number;
  attenuation_percent: number;
  wave_height_reduction_percent?: number;
  inshore_wave_height_m?: number;
  confidence_lower: number | null;
  confidence_upper: number | null;
  raw_output?: {
    wavenumber_k: number;
    wavelength_m: number;
    submergence_ratio: number;
    bulk_drag_coefficient_cd: number;
    damping_factor_kd: number;
    inshore_wave_height_m: number;
    wave_height_reduction_percent: number;
    distance_decay_profile: DecayProfilePoint[];
  };
  created_at: string;
}

export interface PredictionRequest {
  survey_id?: string;
  seagrass_density: number;
  blade_length_cm: number;
  water_depth_m: number;
  wave_height_m: number;
  wave_period_s: number;
  meadow_length_m?: number;
}

export function usePredictWaveAttenuation() {
  return useMutation({
    mutationFn: async (body: PredictionRequest): Promise<PredictionResponse> => {
      const { data } = await apiClient.post<PredictionResponse>(
        "/predictions/wave-attenuation",
        body
      );
      return data;
    },
  });
}

export function useSurveyPredictions(surveyId: string | null) {
  return useQuery({
    queryKey: ["predictions", "survey", surveyId],
    queryFn: async (): Promise<PredictionResponse[]> => {
      if (!surveyId) return [];
      const { data } = await apiClient.get<PredictionResponse[]>(
        `/predictions/survey/${surveyId}`
      );
      return data;
    },
    enabled: !!surveyId,
  });
}
