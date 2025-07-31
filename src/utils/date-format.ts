/**
 * Date formatting utilities
 */
import { DATE_FORMATS } from "@/constants/app";

export interface DateFormatOptions {
  /**
   * Date format to use (default: 'MM/DD/YYYY')
   */
  format?: keyof typeof DATE_FORMATS;
  /**
   * Locale for date formatting (default: 'en-US')
   */
  locale?: string;
  /**
   * Whether to show time (default: false)
   */
  showTime?: boolean;
  /**
   * Whether to show seconds (default: false, only applies when showTime is true)
   */
  showSeconds?: boolean;
  /**
   * Whether to show timezone (default: false, only applies when showTime is true)
   */
  showTimezone?: boolean;
}

/**
 * Format a date according to the specified format
 *
 * @param date - Date to format (Date object, string, or timestamp)
 * @param options - Date formatting options
 * @returns Formatted date string
 *
 * @example
 * formatDate(new Date('2024-01-15')) // "01/15/2024"
 * formatDate(new Date('2024-01-15'), { format: 'DD/MM/YYYY' }) // "15/01/2024"
 * formatDate(new Date('2024-01-15'), { format: 'YYYY-MM-DD' }) // "2024-01-15"
 * formatDate(new Date('2024-01-15'), { showTime: true }) // "01/15/2024 12:00 PM"
 */
export function formatDate(
  date: Date | string | number | null | undefined,
  options: DateFormatOptions = {}
): string {
  const {
    format = "MM/DD/YYYY",
    locale = "en-US",
    showTime = false,
    showSeconds = false,
    showTimezone = false,
  } = options;

  // Handle null, undefined, or invalid dates
  if (!date) {
    return "";
  }

  let dateObj: Date;

  try {
    dateObj = date instanceof Date ? date : new Date(date);

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return "";
    }
  } catch {
    return "";
  }

  // Format based on the specified format
  switch (format) {
    case "MM/DD/YYYY":
      return formatMMDDYYYY(dateObj, locale, showTime, showSeconds, showTimezone);
    case "DD/MM/YYYY":
      return formatDDMMYYYY(dateObj, locale, showTime, showSeconds, showTimezone);
    case "YYYY-MM-DD":
      return formatYYYYMMDD(dateObj, locale, showTime, showSeconds, showTimezone);
    default:
      return formatMMDDYYYY(dateObj, locale, showTime, showSeconds, showTimezone);
  }
}

/**
 * Format date as MM/DD/YYYY
 */
function formatMMDDYYYY(
  date: Date,
  locale: string,
  showTime: boolean,
  showSeconds: boolean,
  showTimezone: boolean
): string {
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();

  let result = `${month}/${day}/${year}`;

  if (showTime) {
    result += ` ${formatTime(date, locale, showSeconds, showTimezone)}`;
  }

  return result;
}

/**
 * Format date as DD/MM/YYYY
 */
function formatDDMMYYYY(
  date: Date,
  locale: string,
  showTime: boolean,
  showSeconds: boolean,
  showTimezone: boolean
): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  let result = `${day}/${month}/${year}`;

  if (showTime) {
    result += ` ${formatTime(date, locale, showSeconds, showTimezone)}`;
  }

  return result;
}

/**
 * Format date as YYYY-MM-DD
 */
function formatYYYYMMDD(
  date: Date,
  locale: string,
  showTime: boolean,
  showSeconds: boolean,
  showTimezone: boolean
): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  let result = `${year}-${month}-${day}`;

  if (showTime) {
    result += ` ${formatTime(date, locale, showSeconds, showTimezone)}`;
  }

  return result;
}

/**
 * Format time component
 */
function formatTime(
  date: Date,
  locale: string,
  showSeconds: boolean,
  showTimezone: boolean
): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  if (showSeconds) {
    options.second = "2-digit";
  }

  if (showTimezone) {
    options.timeZoneName = "short";
  }

  return date.toLocaleTimeString(locale, options);
}

/**
 * Format date for display in a human-readable format
 *
 * @param date - Date to format
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Human-readable date string
 *
 * @example
 * formatDateHuman(new Date('2024-01-15')) // "January 15, 2024"
 * formatDateHuman(new Date('2024-01-15'), 'uk') // "15 січня 2024"
 */
export function formatDateHuman(
  date: Date | string | number | null | undefined,
  locale: string = "en-US"
): string {
  if (!date) {
    return "";
  }

  let dateObj: Date;

  try {
    dateObj = date instanceof Date ? date : new Date(date);

    if (isNaN(dateObj.getTime())) {
      return "";
    }
  } catch {
    return "";
  }

  return dateObj.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format date for display in a short human-readable format
 *
 * @param date - Date to format
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Short human-readable date string
 *
 * @example
 * formatDateShort(new Date('2024-01-15')) // "Jan 15, 2024"
 * formatDateShort(new Date('2024-01-15'), 'uk') // "15 січ 2024"
 */
export function formatDateShort(
  date: Date | string | number | null | undefined,
  locale: string = "en-US"
): string {
  if (!date) {
    return "";
  }

  let dateObj: Date;

  try {
    dateObj = date instanceof Date ? date : new Date(date);

    if (isNaN(dateObj.getTime())) {
      return "";
    }
  } catch {
    return "";
  }

  return dateObj.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format relative time (e.g., "2 hours ago", "yesterday")
 *
 * @param date - Date to format
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Relative time string
 *
 * @example
 * formatRelativeTime(new Date()) // "just now"
 * formatRelativeTime(new Date(Date.now() - 3600000)) // "1 hour ago"
 */
export function formatRelativeTime(
  date: Date | string | number | null | undefined,
  locale: string = "en-US"
): string {
  if (!date) {
    return "";
  }

  let dateObj: Date;

  try {
    dateObj = date instanceof Date ? date : new Date(date);

    if (isNaN(dateObj.getTime())) {
      return "";
    }
  } catch {
    return "";
  }

  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return "just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
  } else {
    return formatDateShort(dateObj, locale);
  }
}

/**
 * Parse a date string according to the specified format
 *
 * @param dateString - Date string to parse
 * @param format - Expected date format
 * @returns Date object or null if invalid
 *
 * @example
 * parseDate("01/15/2024", "MM/DD/YYYY") // Date object
 * parseDate("15/01/2024", "DD/MM/YYYY") // Date object
 * parseDate("2024-01-15", "YYYY-MM-DD") // Date object
 */
export function parseDate(
  dateString: string,
  format: keyof typeof DATE_FORMATS = "MM/DD/YYYY"
): Date | null {
  if (!dateString || typeof dateString !== "string") {
    return null;
  }

  try {
    switch (format) {
      case "MM/DD/YYYY": {
        const [month, day, year] = dateString.split("/");
        if (month && day && year) {
          const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          return isNaN(date.getTime()) ? null : date;
        }
        break;
      }
      case "DD/MM/YYYY": {
        const [day, month, year] = dateString.split("/");
        if (day && month && year) {
          const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          return isNaN(date.getTime()) ? null : date;
        }
        break;
      }
      case "YYYY-MM-DD": {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date;
      }
    }
  } catch {
    return null;
  }

  return null;
}
