/**
 * Survey API client and types.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "./client";

export interface Survey {
  id: string;
  title: string;
  description: string | null;
  surveyor_name: string | null;
  location_name: string | null;
  status: "draft" | "in_progress" | "completed";
  center_latitude: number | null;
  center_longitude: number | null;
  image_count: number;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SurveyImage {
  id: string;
  survey_id: string;
  filename: string;
  s3_key: string;
  content_type: string;
  url: string | null;
  gps_latitude: number | null;
  gps_longitude: number | null;
  captured_at: string | null;
  created_at: string;
}

export interface Transect {
  id: string;
  survey_id: string;
  name: string;
  start_point?: [number, number];
  end_point?: [number, number];
  quadrat_count: number;
  created_at: string;
}

export interface SurveyList {
  items: Survey[];
  total: number;
  page: number;
  page_size: number;
}

export interface CreateSurveyInput {
  title: string;
  description?: string;
  surveyor_name?: string;
  location_name?: string;
  center_latitude?: number;
  center_longitude?: number;
}

// ── Query hooks ──────────────────────────────────────────────

export function useSurveys(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ["surveys", page, pageSize],
    queryFn: async (): Promise<SurveyList> => {
      const { data } = await apiClient.get<SurveyList>("/surveys", {
        params: { page, page_size: pageSize },
      });
      return data;
    },
  });
}

export function useSurvey(id: string | null) {
  return useQuery({
    queryKey: ["surveys", id],
    queryFn: async (): Promise<Survey> => {
      const { data } = await apiClient.get<Survey>(`/surveys/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useSurveyImages(surveyId: string | null) {
  return useQuery({
    queryKey: ["surveys", surveyId, "images"],
    queryFn: async (): Promise<SurveyImage[]> => {
      if (!surveyId) return [];
      const { data } = await apiClient.get<SurveyImage[]>(`/surveys/${surveyId}/images`);
      return data;
    },
    enabled: !!surveyId,
  });
}

export function useSurveyTransects(surveyId: string | null) {
  return useQuery({
    queryKey: ["surveys", surveyId, "transects"],
    queryFn: async (): Promise<Transect[]> => {
      if (!surveyId) return [];
      const { data } = await apiClient.get<Transect[]>(`/surveys/${surveyId}/transects`);
      return data;
    },
    enabled: !!surveyId,
  });
}

// ── Mutation hooks ───────────────────────────────────────────

export function useCreateSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: CreateSurveyInput): Promise<Survey> => {
      const { data } = await apiClient.post<Survey>("/surveys", body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["surveys"] });
    },
  });
}

export function useUploadSurveyImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      surveyId,
      file,
      latitude,
      longitude,
    }: {
      surveyId: string;
      file: File;
      latitude?: number;
      longitude?: number;
    }): Promise<SurveyImage> => {
      const formData = new FormData();
      formData.append("file", file);
      const queryParams = new URLSearchParams();
      if (latitude !== undefined) queryParams.set("latitude", latitude.toString());
      if (longitude !== undefined) queryParams.set("longitude", longitude.toString());

      const { data } = await apiClient.post<SurveyImage>(
        `/surveys/${surveyId}/images?${queryParams.toString()}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["surveys", variables.surveyId, "images"] });
      queryClient.invalidateQueries({ queryKey: ["surveys"] });
    },
  });
}
