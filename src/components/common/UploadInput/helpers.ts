/**
 * Utility functions for UploadInput component
 */
import { FILE_SIZE_CONSTANTS } from "./constants";

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(FILE_SIZE_CONSTANTS.KILOBYTE));
  return (
    parseFloat((bytes / Math.pow(FILE_SIZE_CONSTANTS.KILOBYTE, i)).toFixed(2)) +
    " " +
    FILE_SIZE_CONSTANTS.SIZE_UNITS[i]
  );
}
