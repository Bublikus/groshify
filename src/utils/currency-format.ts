/**
 * Currency formatting utilities
 */
import { CURRENCIES } from "@/constants/app";

export interface CurrencyFormatOptions {
  /**
   * Currency code (e.g., 'USD', 'EUR', 'UAH')
   */
  currency?: keyof typeof CURRENCIES;
  /**
   * Decimal places to show (default: 2)
   */
  decimals?: number;
  /**
   * Whether to show positive sign for positive numbers (default: false)
   */
  showPositiveSign?: boolean;
  /**
   * Whether to show negative sign for negative numbers (default: true)
   */
  showNegativeSign?: boolean;
  /**
   * Whether to show zero values (default: true)
   */
  showZero?: boolean;
  /**
   * Text to show for zero values (default: '0')
   */
  zeroText?: string;
}

/**
 * Format a number as currency with proper symbol and formatting
 *
 * @param value - The number to format
 * @param options - Currency formatting options
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(1234567.89, { currency: 'USD' }) // "$1,234,567.89"
 * formatCurrency(1234567.89, { currency: 'EUR' }) // "€1,234,567.89"
 * formatCurrency(1234567.89, { currency: 'UAH' }) // "₴1,234,567.89"
 */
export function formatCurrency(
  value: number | string | null | undefined,
  options: CurrencyFormatOptions = {}
): string {
  const {
    currency = "USD",
    decimals = 2,
    showPositiveSign = false,
    showNegativeSign = true,
    showZero = true,
    zeroText = "0",
  } = options;

  // Handle null, undefined, or empty values
  if (value === null || value === undefined || value === "") {
    return showZero ? `${CURRENCIES[currency].symbol}${zeroText}` : "";
  }

  // Convert to number
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  // Handle NaN
  if (isNaN(numValue)) {
    return showZero ? `${CURRENCIES[currency].symbol}${zeroText}` : "";
  }

  // Handle zero
  if (numValue === 0) {
    if (!showZero) return "";
    return `${CURRENCIES[currency].symbol}${zeroText}`;
  }

  // Determine sign
  const isNegative = numValue < 0;
  const absValue = Math.abs(numValue);

  // Format the number with proper locale formatting
  const formattedNumber = absValue.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  // Build the result string
  let result = `${CURRENCIES[currency].symbol}${formattedNumber}`;

  // Add signs
  if (isNegative && showNegativeSign) {
    result = `-${result}`;
  } else if (!isNegative && showPositiveSign) {
    result = `+${result}`;
  }

  return result;
}

/**
 * Get currency symbol by currency code
 *
 * @param currency - Currency code
 * @returns Currency symbol
 *
 * @example
 * getCurrencySymbol('USD') // "$"
 * getCurrencySymbol('EUR') // "€"
 */
export function getCurrencySymbol(currency: keyof typeof CURRENCIES): string {
  return CURRENCIES[currency].symbol;
}

/**
 * Get currency name by currency code
 *
 * @param currency - Currency code
 * @returns Currency name
 *
 * @example
 * getCurrencyName('USD') // "US Dollar"
 * getCurrencyName('EUR') // "Euro"
 */
export function getCurrencyName(currency: keyof typeof CURRENCIES): string {
  return CURRENCIES[currency].name;
}

/**
 * Parse a formatted currency string back to a number
 *
 * @param formattedValue - The formatted currency string
 * @param currency - Currency code to identify the symbol
 * @returns Parsed number or null if invalid
 *
 * @example
 * parseFormattedCurrency("$1,234,567.89", "USD") // 1234567.89
 * parseFormattedCurrency("€1,234,567.89", "EUR") // 1234567.89
 */
export function parseFormattedCurrency(
  formattedValue: string,
  currency: keyof typeof CURRENCIES
): number | null {
  if (!formattedValue || typeof formattedValue !== "string") {
    return null;
  }

  const symbol = CURRENCIES[currency].symbol;

  // Remove currency symbol and signs
  const cleanValue = formattedValue
    .replace(new RegExp(`[${symbol.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}]`, "g"), "")
    .replace(/[^\d.,-]/g, "") // Remove all non-digit, non-dot, non-comma, non-minus characters
    .replace(/^-/, ""); // Remove leading minus (we'll handle sign separately)

  // Check if original value was negative
  const isNegative = formattedValue.startsWith("-");

  // Parse the number (assuming US locale format with commas as thousands separators)
  const normalizedValue = cleanValue.replace(/,/g, "");
  const parsed = parseFloat(normalizedValue);

  if (isNaN(parsed)) {
    return null;
  }

  return isNegative ? -parsed : parsed;
}
