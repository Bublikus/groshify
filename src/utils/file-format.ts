/**
 * File formatting utilities
 */

export interface FileSizeConstants {
  KILOBYTE: number;
  MEGABYTE: number;
  GIGABYTE: number;
  SIZE_UNITS: readonly string[];
}

export const FILE_SIZE_CONSTANTS: FileSizeConstants = {
  KILOBYTE: 1024,
  MEGABYTE: 1024 * 1024,
  GIGABYTE: 1024 * 1024 * 1024,
  SIZE_UNITS: ["Bytes", "KB", "MB", "GB", "TB"] as const,
} as const;

export interface FileFormatOptions {
  /**
   * Number of decimal places for file size (default: 2)
   */
  decimals?: number;
  /**
   * Whether to show the unit (default: true)
   */
  showUnit?: boolean;
  /**
   * Whether to use binary prefixes (KiB, MiB, etc.) (default: false)
   */
  useBinaryPrefixes?: boolean;
}

/**
 * Format file size for display
 *
 * @param bytes - File size in bytes
 * @param options - Formatting options
 * @returns Formatted file size string
 *
 * @example
 * formatFileSize(1024) // "1 KB"
 * formatFileSize(1048576) // "1 MB"
 * formatFileSize(1024, { decimals: 0 }) // "1 KB"
 * formatFileSize(1024, { showUnit: false }) // "1"
 */
export function formatFileSize(bytes: number, options: FileFormatOptions = {}): string {
  const { decimals = 2, showUnit = true, useBinaryPrefixes = false } = options;

  if (bytes === 0) {
    return showUnit ? "0 Bytes" : "0";
  }

  const constants = useBinaryPrefixes ? BINARY_SIZE_CONSTANTS : FILE_SIZE_CONSTANTS;
  const i = Math.floor(Math.log(bytes) / Math.log(constants.KILOBYTE));

  const size = parseFloat((bytes / Math.pow(constants.KILOBYTE, i)).toFixed(decimals));
  const unit = constants.SIZE_UNITS[i];

  return showUnit ? `${size} ${unit}` : size.toString();
}

/**
 * Binary size constants (KiB, MiB, etc.)
 */
const BINARY_SIZE_CONSTANTS: FileSizeConstants = {
  KILOBYTE: 1024,
  MEGABYTE: 1024 * 1024,
  GIGABYTE: 1024 * 1024 * 1024,
  SIZE_UNITS: ["Bytes", "KiB", "MiB", "GiB", "TiB"] as const,
} as const;

/**
 * Parse file size string back to bytes
 *
 * @param sizeString - Formatted file size string
 * @returns Size in bytes or null if invalid
 *
 * @example
 * parseFileSize("1 KB") // 1024
 * parseFileSize("1.5 MB") // 1572864
 * parseFileSize("2 GB") // 2147483648
 */
export function parseFileSize(sizeString: string): number | null {
  if (!sizeString || typeof sizeString !== "string") {
    return null;
  }

  const match = sizeString.trim().match(/^([\d.]+)\s*([KMGT]?[i]?B?)$/i);
  if (!match) {
    return null;
  }

  const [, sizeStr, unit] = match;
  const size = parseFloat(sizeStr);

  if (isNaN(size)) {
    return null;
  }

  const unitUpper = unit.toUpperCase();
  let multiplier = 1;

  switch (unitUpper) {
    case "KB":
    case "KIB":
      multiplier = 1024;
      break;
    case "MB":
    case "MIB":
      multiplier = 1024 * 1024;
      break;
    case "GB":
    case "GIB":
      multiplier = 1024 * 1024 * 1024;
      break;
    case "TB":
    case "TIB":
      multiplier = 1024 * 1024 * 1024 * 1024;
      break;
    case "B":
    case "":
      multiplier = 1;
      break;
    default:
      return null;
  }

  return size * multiplier;
}

/**
 * Validate file extension
 *
 * @param filename - File name to validate
 * @param supportedExtensions - Array of supported file extensions (with or without dot)
 * @returns Whether the file extension is supported
 *
 * @example
 * validateFileExtension("document.pdf", [".pdf", ".doc", ".docx"]) // true
 * validateFileExtension("image.jpg", ["pdf", "doc"]) // false
 */
export function validateFileExtension(filename: string, supportedExtensions: string[]): boolean {
  if (!filename || typeof filename !== "string") {
    return false;
  }

  const extension = filename.split(".").pop()?.toLowerCase();
  if (!extension) {
    return false;
  }

  return supportedExtensions.some((ext) => {
    const cleanExt = ext.toLowerCase().replace(/^\./, "");
    return cleanExt === extension;
  });
}

/**
 * Get file extension from filename
 *
 * @param filename - File name
 * @param includeDot - Whether to include the dot prefix (default: false)
 * @returns File extension or empty string if not found
 *
 * @example
 * getFileExtension("document.pdf") // "pdf"
 * getFileExtension("document.pdf", true) // ".pdf"
 * getFileExtension("noextension") // ""
 */
export function getFileExtension(filename: string, includeDot: boolean = false): string {
  if (!filename || typeof filename !== "string") {
    return "";
  }

  const extension = filename.split(".").pop()?.toLowerCase();
  if (!extension) {
    return "";
  }

  return includeDot ? `.${extension}` : extension;
}

/**
 * Get filename without extension
 *
 * @param filename - File name
 * @returns Filename without extension
 *
 * @example
 * getFilenameWithoutExtension("document.pdf") // "document"
 * getFilenameWithoutExtension("image.jpg") // "image"
 * getFilenameWithoutExtension("noextension") // "noextension"
 */
export function getFilenameWithoutExtension(filename: string): string {
  if (!filename || typeof filename !== "string") {
    return "";
  }

  const lastDotIndex = filename.lastIndexOf(".");
  return lastDotIndex > 0 ? filename.substring(0, lastDotIndex) : filename;
}

/**
 * Generate unique filename
 *
 * @param originalFilename - Original filename
 * @param prefix - Prefix for the unique ID (default: "file")
 * @returns Unique filename
 *
 * @example
 * generateUniqueFilename("document.pdf") // "document_1703123456789_abc123.pdf"
 * generateUniqueFilename("image.jpg", "img") // "image_1703123456789_abc123.jpg"
 */
export function generateUniqueFilename(originalFilename: string, prefix: string = "file"): string {
  if (!originalFilename || typeof originalFilename !== "string") {
    return "";
  }

  const extension = getFileExtension(originalFilename, true);
  const nameWithoutExt = getFilenameWithoutExtension(originalFilename);
  const uniqueId = `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return `${nameWithoutExt}_${uniqueId}${extension}`;
}

/**
 * Format file type for display
 *
 * @param filename - File name
 * @returns Formatted file type string
 *
 * @example
 * formatFileType("document.pdf") // "PDF Document"
 * formatFileType("image.jpg") // "JPEG Image"
 * formatFileType("data.csv") // "CSV File"
 */
export function formatFileType(filename: string): string {
  if (!filename || typeof filename !== "string") {
    return "Unknown File";
  }

  const extension = getFileExtension(filename);

  const fileTypes: Record<string, string> = {
    // Documents
    pdf: "PDF Document",
    doc: "Word Document",
    docx: "Word Document",
    txt: "Text File",
    rtf: "Rich Text File",

    // Spreadsheets
    xls: "Excel Spreadsheet",
    xlsx: "Excel Spreadsheet",
    csv: "CSV File",

    // Images
    jpg: "JPEG Image",
    jpeg: "JPEG Image",
    png: "PNG Image",
    gif: "GIF Image",
    bmp: "BMP Image",
    svg: "SVG Image",
    webp: "WebP Image",

    // Archives
    zip: "ZIP Archive",
    rar: "RAR Archive",
    "7z": "7-Zip Archive",
    tar: "TAR Archive",
    gz: "GZIP Archive",

    // Audio
    mp3: "MP3 Audio",
    wav: "WAV Audio",
    flac: "FLAC Audio",
    aac: "AAC Audio",

    // Video
    mp4: "MP4 Video",
    avi: "AVI Video",
    mov: "MOV Video",
    wmv: "WMV Video",
    mkv: "MKV Video",
  };

  return fileTypes[extension] || `${extension.toUpperCase()} File`;
}

/**
 * Check if file is an image
 *
 * @param filename - File name
 * @returns Whether the file is an image
 *
 * @example
 * isImageFile("photo.jpg") // true
 * isImageFile("document.pdf") // false
 */
export function isImageFile(filename: string): boolean {
  const extension = getFileExtension(filename);
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"];
  return imageExtensions.includes(extension);
}

/**
 * Check if file is a document
 *
 * @param filename - File name
 * @returns Whether the file is a document
 *
 * @example
 * isDocumentFile("document.pdf") // true
 * isDocumentFile("photo.jpg") // false
 */
export function isDocumentFile(filename: string): boolean {
  const extension = getFileExtension(filename);
  const documentExtensions = ["pdf", "doc", "docx", "txt", "rtf"];
  return documentExtensions.includes(extension);
}

/**
 * Check if file is a spreadsheet
 *
 * @param filename - File name
 * @returns Whether the file is a spreadsheet
 *
 * @example
 * isSpreadsheetFile("data.xlsx") // true
 * isSpreadsheetFile("document.pdf") // false
 */
export function isSpreadsheetFile(filename: string): boolean {
  const extension = getFileExtension(filename);
  const spreadsheetExtensions = ["xls", "xlsx", "csv"];
  return spreadsheetExtensions.includes(extension);
}
