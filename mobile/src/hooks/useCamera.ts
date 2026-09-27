/**
 * Camera hook wrapping expo-camera and expo-image-picker.
 *
 * Provides a unified interface for capturing photos or
 * selecting from the gallery.
 */

export function useCamera() {
  // TODO: Implement after expo-camera/expo-image-picker installed
  // - Request camera permissions
  // - Launch camera or image picker
  // - Return captured image URI with EXIF/GPS metadata
  // - Clean up subscriptions on unmount
  return {
    capturePhoto: async () => null,
    pickFromGallery: async () => null,
    hasPermission: false,
  };
}
