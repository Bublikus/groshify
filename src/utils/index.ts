/**
 * Utils index - exports all formatting utilities
 */

// Core utilities
export { cn } from "./cn";

// Search and sort utilities
export {
  sortBySearchRelevance,
  type SearchableItem,
  type SearchField,
  type SearchSortOptions,
} from "./search-sort";

// Number formatting
export {
  formatNumber,
  formatCurrency as formatNumberCurrency,
  formatPercentage,
  parseFormattedNumber,
  type NumberFormatOptions,
} from "./number-format";

// Currency formatting
export {
  formatCurrency,
  getCurrencySymbol,
  getCurrencyName,
  parseFormattedCurrency,
  type CurrencyFormatOptions,
} from "./currency-format";

// Date formatting
export {
  formatDate,
  formatDateHuman,
  formatDateShort,
  formatRelativeTime,
  parseDate,
  type DateFormatOptions,
} from "./date-format";

// Text formatting
export {
  formatText,
  capitalizeWords,
  toTitleCase,
  toSentenceCase,
  toCamelCase,
  toKebabCase,
  toSnakeCase,
  toPascalCase,
  stripHtmlTags,
  escapeHtml,
  unescapeHtml,
  generateSlug,
  maskText,
  type TextFormatOptions,
} from "./text-format";

// File formatting
export {
  formatFileSize,
  parseFileSize,
  validateFileExtension,
  getFileExtension,
  getFilenameWithoutExtension,
  generateUniqueFilename,
  formatFileType,
  isImageFile,
  isDocumentFile,
  isSpreadsheetFile,
  FILE_SIZE_CONSTANTS,
  type FileFormatOptions,
  type FileSizeConstants,
} from "./file-format";

// Language formatting
export {
  formatLanguage,
  getLanguageName,
  getLanguageFlag,
  getAvailableLanguages,
  getAvailableLanguagesWithDetails,
  isLanguageSupported,
  getDefaultLanguage,
  getLanguageFromLocale,
  formatLocale,
  getBrowserLanguages,
  getPreferredLanguage,
  formatLanguageList,
  getLanguageDirection,
  type LanguageFormatOptions,
} from "./language-format";
