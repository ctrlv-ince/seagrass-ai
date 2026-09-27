/**
 * Survey API hooks and functions.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import apiClient from "./client";

// ── Zod schemas for API response validation ──────────────────

const SurveySchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  surveyor_name: z.string().nullable(),
  location_name: z.string().nullable(),
  status: z.string(),
  started_at: z.string().nullable(),
  completed_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

const SurveyListSchema = z.object({
  items: z.array(SurveySchema),
  total: z.number(),
  page: z.number(),
  page_size: z.number(),
});

export type Survey = z.infer<typeof SurveySchema>;
export type SurveyList = z.infer<typeof SurveyListSchema>;

// ── Query hooks ──────────────────────────────────────────────

export function useSurveys(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ["surveys", page, pageSize],
    queryFn: async () => {
      const { data } = await apiClient.get("/surveys", {
        params: { page, page_size: pageSize },
      });
      return SurveyListSchema.parse(data);
    },
  });
}

export function useSurvey(id: string) {
  return useQuery({
    queryKey: ["surveys", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/surveys/${id}`);
      return SurveySchema.parse(data);
    },
    enabled: !!id,
  });
}

// ── Mutation hooks ───────────────────────────────────────────

export function useCreateSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: {
      title: string;
      description?: string;
      surveyor_name?: string;
      location_name?: string;
    }) => {
      const { data } = await apiClient.post("/surveys", body);
      return SurveySchema.parse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["surveys"] });
    },
  });
}
