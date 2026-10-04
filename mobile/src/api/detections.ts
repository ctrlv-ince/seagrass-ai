import apiClient from "./client";

export interface DetectionResponse {
  specifications: {
    primary_species: string;
    common_name: string;
    confidence: number;
    coverage_percent: number;
    blade_length_cm: number;
    shoot_density_m2: number;
  };
  wave_attenuation: {
    incident_wave_height_m: number;
    transmitted_wave_height_m: number;
    wave_height_reduction_pct: number;
    wave_energy_damping_pct: number;
  };
  image_id?: string | null;
  image_url?: string | null;
}

export interface AnalyzeImageParams {
  fileUri: string;
  filename?: string;
  waterDepthM?: number;
  incidentWaveHeightM?: number;
  wavePeriodS?: number;
  meadowWidthM?: number;
  surveyId?: string;
}

/**
 * Upload a quadrat field photo to FastAPI for YOLO species classification,
 * morphometric estimation, and hydrodynamic wave damping computation.
 */
export async function analyzeQuadratPhoto(
  params: AnalyzeImageParams
): Promise<DetectionResponse> {
  const formData = new FormData();
  const name = params.filename || params.fileUri.split("/").pop() || "quadrat.jpg";

  // React Native FormData file representation
  formData.append("file", {
    uri: params.fileUri,
    name,
    type: "image/jpeg",
  } as any);

  const queryParams: Record<string, string> = {
    water_depth_m: (params.waterDepthM ?? 1.5).toString(),
    incident_wave_height_m: (params.incidentWaveHeightM ?? 0.8).toString(),
    wave_period_s: (params.wavePeriodS ?? 4.5).toString(),
    meadow_width_m: (params.meadowWidthM ?? 50.0).toString(),
  };

  if (params.surveyId) {
    queryParams.survey_id = params.surveyId;
  }

  const queryString = new URLSearchParams(queryParams).toString();

  const response = await apiClient.post<DetectionResponse>(
    `/detections/analyze?${queryString}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 45_000, // 45s for deep learning inference over mobile networks
    }
  );

  return response.data;
}
