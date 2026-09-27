/**
 * Wave attenuation prediction API hooks.
 */
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import apiClient from "./client";

// ── Zod schemas ──────────────────────────────────────────────

const PredictionResponseSchema = z.object({
  id: z.string().uuid(),
  survey_id: z.string().uuid().nullable(),
  model_version: z.string(),
  seagrass_density: z.number(),
  blade_length_cm: z.number(),
  water_depth_m: z.number(),
  wave_height_m: z.number(),
  wave_period_s: z.number(),
  attenuation_percent: z.number(),
  confidence_lower: z.number().nullable(),
  confidence_upper: z.number().nullable(),
  created_at: z.string(),
});

export type PredictionResponse = z.infer<typeof PredictionResponseSchema>;

export type PredictionRequest = {
  survey_id?: string;
  seagrass_density: number;
  blade_length_cm: number;
  water_depth_m: number;
  wave_height_m: number;
  wave_period_s: number;
};

// ── Mutation hooks ───────────────────────────────────────────

export function usePredictWaveAttenuation() {
  return useMutation({
    mutationFn: async (body: PredictionRequest) => {
      const { data } = await apiClient.post(
        "/predictions/wave-attenuation",
        body
      );
      return PredictionResponseSchema.parse(data);
    },
  });
}
