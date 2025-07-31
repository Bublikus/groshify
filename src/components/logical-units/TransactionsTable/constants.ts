/**
 * Constants for TransactionsTable component
 */

export const MONTH_ORDER = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const FILE_SIZE_CONSTANTS = {
  KILOBYTE: 1024,
  SIZE_UNITS: ["Bytes", "KB", "MB", "GB"] as const,
} as const;

export const DEFAULT_CATEGORY = "Other Transactions" as const;

export const DATE_FORMAT_OPTIONS = {
  month: "long",
} as const;

export const COLUMN_INDICES = {
  DATE_COLUMN: 2,
  AMOUNT_COLUMN: 4,
} as const;
