/**
 * Mobile Image Preparation & Compression Helper.
 * Prepares field quadrat photos for low-bandwidth cellular transmission.
 */

export interface ImagePrepOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export const DEFAULT_PREP_OPTIONS: ImagePrepOptions = {
  maxWidth: 1280,
  maxHeight: 960,
  quality: 0.8,
};

/**
 * Format bytes into human readable KB / MB string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Generate a timestamped filename for a field quadrat photo.
 */
export function generateQuadratFilename(prefix = "quadrat"): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `${prefix}_${timestamp}_${randomSuffix}.jpg`;
}
