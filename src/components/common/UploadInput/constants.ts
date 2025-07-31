/**
 * Constants for UploadInput component
 */

export const FILE_SIZE_CONSTANTS = {
  KILOBYTE: 1024,
  MEGABYTE: 1024 * 1024,
  SIZE_UNITS: ["Bytes", "KB", "MB", "GB"] as const,
} as const;

export const SEARCH_QUERY_LIMITS = {
  MAX_LENGTH: 100,
} as const;

export const PROBLEMATIC_CHARS_REGEX = /[<>{}]/;
