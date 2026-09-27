/**
 * Detection (YOLOv11) API hooks and functions.
 */
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import apiClient from "./client";

// ── Zod schemas ──────────────────────────────────────────────

const DetectionResultSchema = z.object({
  status: z.string(),
  message: z.string().optional(),
  filename: z.string().nullable(),
});

export type DetectionResult = z.infer<typeof DetectionResultSchema>;

// ── Mutation hooks ───────────────────────────────────────────

export function useAnalyzeImage() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await apiClient.post("/detections/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60_000, // Inference can be slow
      });
      return DetectionResultSchema.parse(data);
    },
  });
}
