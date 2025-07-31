import type { ParsedRow } from "@/parsers/types";
import {
  COLUMN_INDICES,
  DATE_FORMAT_OPTIONS,
  DEFAULT_CATEGORY,
  FILE_SIZE_CONSTANTS,
  MONTH_ORDER,
} from "./constants";
import type { CategorySummary, CurrentSums, MonthData } from "./types";

/**
 * Extract numeric value from a data row column
 */
export function extractNumericValue(value: unknown): number {
  if (value === null || value === undefined || value === "") {
    return 0;
  }
  const numValue = typeof value === "number" ? value : parseFloat(String(value));
  return isNaN(numValue) ? 0 : numValue;
}

/**
 * Calculate sums from an array of numeric values
 */
export function calculateSums(values: number[]): CurrentSums {
  const positiveSum = values.filter((value) => value > 0).reduce((sum, value) => sum + value, 0);
  const negativeSum = values.filter((value) => value < 0).reduce((sum, value) => sum + value, 0);
  const totalSum = positiveSum + negativeSum;

  return { positiveSum, negativeSum, totalSum };
}

/**
 * Extract column data from rows
 */
export function extractColumnData(rows: ParsedRow[], columnIndex: number): number[] {
  return rows.map((row) => {
    const columnValue = row[Object.keys(row)[columnIndex]];
    return extractNumericValue(columnValue);
  });
}

/**
 * Group data by month
 */
export function groupDataByMonth(data: ParsedRow[], headers: string[]): Map<string, MonthData> {
  const monthGroups = new Map<string, MonthData>();

  data.forEach((row) => {
    // Extract date from column 3 (0-indexed)
    const dateValue = row[headers[COLUMN_INDICES.DATE_COLUMN]];
    if (!dateValue) return;

    const date = new Date(String(dateValue));
    if (isNaN(date.getTime())) return;

    const month = date.toLocaleDateString("en-US", DATE_FORMAT_OPTIONS);
    const year = date.getFullYear();
    const monthKey = `${month} ${year}`;

    if (!monthGroups.has(monthKey)) {
      monthGroups.set(monthKey, {
        month,
        year,
        data: [],
        positiveSum: 0,
        negativeSum: 0,
        totalSum: 0,
      });
    }

    const monthData = monthGroups.get(monthKey)!;
    monthData.data.push(row);

    // Calculate column 5 sums
    if (headers.length >= 5) {
      const column5Value = row[headers[COLUMN_INDICES.AMOUNT_COLUMN]];
      const numValue = extractNumericValue(column5Value);

      if (numValue > 0) {
        monthData.positiveSum += numValue;
      } else if (numValue < 0) {
        monthData.negativeSum += numValue;
      }
      monthData.totalSum += numValue;
    }
  });

  return monthGroups;
}

/**
 * Sort month data chronologically
 */
export function sortMonthData(monthData: MonthData[]): MonthData[] {
  return monthData.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    const aMonthIndex = MONTH_ORDER.findIndex((month) => a.month.startsWith(month));
    const bMonthIndex = MONTH_ORDER.findIndex((month) => b.month.startsWith(month));
    return aMonthIndex - bMonthIndex;
  });
}

/**
 * Calculate monthly data from rows
 */
export function calculateMonthlyData(data: ParsedRow[], headers: string[]): MonthData[] {
  const monthGroups = groupDataByMonth(data, headers);
  const monthDataArray = Array.from(monthGroups.values());
  return sortMonthData(monthDataArray);
}

/**
 * Calculate overall sums from data
 */
export function calculateOverallSums(data: ParsedRow[], headers: string[]): CurrentSums {
  if (!data.length || !headers.length || headers.length < 5) {
    return { positiveSum: 0, negativeSum: 0, totalSum: 0 };
  }

  const column5Data = data.map((row) => {
    const column5Value = row[headers[COLUMN_INDICES.AMOUNT_COLUMN]];
    return extractNumericValue(column5Value);
  });

  return calculateSums(column5Data);
}

/**
 * Get current month data based on selection
 */
export function getCurrentMonthData(
  data: ParsedRow[],
  monthlyData: MonthData[],
  selectedMonth: string
): ParsedRow[] {
  if (selectedMonth === "all") {
    return data;
  }
  return monthlyData.find((month) => month.month === selectedMonth)?.data || [];
}

/**
 * Get current sums based on selection
 */
export function getCurrentSums(
  overallSums: CurrentSums,
  monthlyData: MonthData[],
  selectedMonth: string
): CurrentSums {
  if (selectedMonth === "all") {
    return overallSums;
  }

  const monthData = monthlyData.find((month) => month.month === selectedMonth);
  return monthData
    ? {
        positiveSum: monthData.positiveSum,
        negativeSum: monthData.negativeSum,
        totalSum: monthData.totalSum,
      }
    : { positiveSum: 0, negativeSum: 0, totalSum: 0 };
}

/**
 * Calculate category summaries from data
 */
export function calculateCategorySummaries(
  data: ParsedRow[],
  headers: string[],
  categories: Record<string, string>
): [string, CategorySummary][] {
  const summaries: Record<string, CategorySummary> = {};

  data.forEach((row) => {
    const category = categories[row.id] || DEFAULT_CATEGORY;
    let amount = 0;

    if (headers.length >= 5) {
      const column5Value = row[headers[COLUMN_INDICES.AMOUNT_COLUMN]];
      amount = extractNumericValue(column5Value);
    }

    if (!summaries[category]) {
      summaries[category] = { count: 0, total: 0 };
    }
    summaries[category].count += 1;
    summaries[category].total += amount;
  });

  return Object.entries(summaries).sort(([, a], [, b]) => Math.abs(b.total) - Math.abs(a.total));
}

/**
 * Validate file extension
 */
export function validateFileExtension(filename: string, supportedExtensions: string[]): boolean {
  const extension = filename.split(".").pop()?.toLowerCase();
  return extension ? supportedExtensions.includes(extension) : false;
}

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

/**
 * Generate unique ID for rows
 */
export function generateRowId(prefix: string = "row"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
