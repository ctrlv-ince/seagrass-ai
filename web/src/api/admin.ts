/**
 * Admin API queries, mutations, and TypeScript definitions.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "./client";
import type { SurveyList } from "./surveys";

// ── Types ──────────────────────────────────────────────────────────

export type UserRole = "admin" | "user";

export interface UserProfile {
  id: string;
  auth_user_id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserList {
  items: UserProfile[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface SpeciesItem {
  id: string;
  scientific_name: string;
  common_name: string | null;
  description: string | null;
  created_at: string;
}

export interface CreateSpeciesInput {
  scientific_name: string;
  common_name?: string;
  description?: string;
}

export interface UpdateSpeciesInput {
  scientific_name?: string;
  common_name?: string;
  description?: string;
}

export interface MonthlySurveyTrend {
  month: string;
  count: number;
}

export interface AdminAnalytics {
  total_surveys: number;
  surveys_by_status: Record<string, number>;
  total_images: number;
  total_species: number;
  total_transects: number;
  total_quadrats: number;
  total_users: number;
  users_by_role: Record<string, number>;
  surveys_monthly_trend: MonthlySurveyTrend[];
  storage_used_bytes: number;
  yolo_model_version: string;
}

export interface SystemInfo {
  status: string;
  database_connected: boolean;
  yolo_model_path: string;
  s3_bucket: string;
  cache_entries: number;
  environment: string;
}

// ── User Management Hooks ──────────────────────────────────────────

export function useAdminUsers(params: {
  page?: number;
  page_size?: number;
  role?: string;
  search?: string;
} = {}) {
  const { page = 1, page_size = 20, role, search } = params;
  return useQuery({
    queryKey: ["admin", "users", page, page_size, role, search],
    queryFn: async (): Promise<UserList> => {
      const { data } = await apiClient.get<UserList>("/admin/users", {
        params: {
          page,
          page_size,
          role: role || undefined,
          search: search || undefined,
        },
      });
      return data;
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole }): Promise<UserProfile> => {
      const { data } = await apiClient.patch<UserProfile>(`/admin/users/${userId}/role`, { role });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "analytics"] });
    },
  });
}

export function useToggleUserActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }): Promise<UserProfile> => {
      const { data } = await apiClient.patch<UserProfile>(`/admin/users/${userId}/active`, {
        is_active: isActive,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

// ── Species CRUD Hooks ─────────────────────────────────────────────

export function useAdminSpecies() {
  return useQuery({
    queryKey: ["admin", "species"],
    queryFn: async (): Promise<SpeciesItem[]> => {
      const { data } = await apiClient.get<SpeciesItem[]>("/admin/species");
      return data;
    },
  });
}

export function useCreateSpecies() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateSpeciesInput): Promise<SpeciesItem> => {
      const { data } = await apiClient.post<SpeciesItem>("/admin/species", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "species"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "analytics"] });
      queryClient.invalidateQueries({ queryKey: ["species"] });
    },
  });
}

export function useUpdateSpecies() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      speciesId,
      payload,
    }: {
      speciesId: string;
      payload: UpdateSpeciesInput;
    }): Promise<SpeciesItem> => {
      const { data } = await apiClient.patch<SpeciesItem>(`/admin/species/${speciesId}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "species"] });
      queryClient.invalidateQueries({ queryKey: ["species"] });
    },
  });
}

export function useDeleteSpecies() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (speciesId: string): Promise<{ message: string }> => {
      const { data } = await apiClient.delete<{ message: string }>(`/admin/species/${speciesId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "species"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "analytics"] });
      queryClient.invalidateQueries({ queryKey: ["species"] });
    },
  });
}

// ── Survey Admin Hooks ─────────────────────────────────────────────

export function useAdminSurveys(params: {
  page?: number;
  page_size?: number;
  status?: string;
  search?: string;
} = {}) {
  const { page = 1, page_size = 20, status, search } = params;
  return useQuery({
    queryKey: ["admin", "surveys", page, page_size, status, search],
    queryFn: async (): Promise<SurveyList> => {
      const { data } = await apiClient.get<SurveyList>("/admin/surveys", {
        params: {
          page,
          page_size,
          status: status || undefined,
          search: search || undefined,
        },
      });
      return data;
    },
  });
}

export function useAdminDeleteSurvey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (surveyId: string): Promise<{ message: string }> => {
      const { data } = await apiClient.delete<{ message: string }>(`/admin/surveys/${surveyId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "surveys"] });
      queryClient.invalidateQueries({ queryKey: ["surveys"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "analytics"] });
    },
  });
}

export function useBulkUpdateSurveyStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      surveyIds,
      status,
    }: {
      surveyIds: string[];
      status: "draft" | "in_progress" | "completed";
    }): Promise<{ updated: number }> => {
      const { data } = await apiClient.post<{ updated: number }>("/admin/surveys/bulk-status", {
        survey_ids: surveyIds,
        status,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "surveys"] });
      queryClient.invalidateQueries({ queryKey: ["surveys"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "analytics"] });
    },
  });
}

// ── Analytics & Diagnostics Hooks ──────────────────────────────────

export function useAdminAnalytics() {
  return useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: async (): Promise<AdminAnalytics> => {
      const { data } = await apiClient.get<AdminAnalytics>("/admin/analytics");
      return data;
    },
    refetchInterval: 60_000,
  });
}

export function useSystemInfo() {
  return useQuery({
    queryKey: ["admin", "system"],
    queryFn: async (): Promise<SystemInfo> => {
      const { data } = await apiClient.get<SystemInfo>("/admin/system");
      return data;
    },
    refetchInterval: 30_000,
  });
}
