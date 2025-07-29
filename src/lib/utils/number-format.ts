/**
 * Number formatting utilities
 */

export interface NumberFormatOptions {
  /**
   * Decimal places to show (default: 2)
   */
  decimals?: number;
  /**
   * Whether to show the currency symbol (default: false)
   */
  showCurrency?: boolean;
  /**
   * Currency symbol to use (default: '$')
   */
  currencySymbol?: string;
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
 * Format a number with dots for thousands separators and commas for decimal divisions
 *
 * @param value - The number to format
 * @param options - Formatting options
 * @returns Formatted number string
 *
 * @example
 * formatNumber(1234567.89) // "1.234.567,89"
 * formatNumber(1234567.89, { showCurrency: true }) // "$1.234.567,89"
 * formatNumber(1234567.89, { decimals: 0 }) // "1.234.568"
 * formatNumber(0, { showZero: false }) // ""
 */
export function formatNumber(
  value: number | string | null | undefined,
  options: NumberFormatOptions = {}
): string {
  const {
    decimals = 2,
    showCurrency = false,
    currencySymbol = "$",
    showPositiveSign = false,
    showNegativeSign = true,
    showZero = true,
    zeroText = "0",
  } = options;

  // Handle null, undefined, or empty values
  if (value === null || value === undefined || value === "") {
    return showZero ? zeroText : "";
  }

  // Convert to number
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  // Handle NaN
  if (isNaN(numValue)) {
    return showZero ? zeroText : "";
  }

  // Handle zero
  if (numValue === 0) {
    if (!showZero) return "";
    return showCurrency ? `${currencySymbol}0` : zeroText;
  }

  // Determine sign
  const isNegative = numValue < 0;
  const absValue = Math.abs(numValue);

  // Format the number with dots for thousands and commas for decimals
  const formattedNumber = formatNumberWithSeparators(absValue, decimals);

  // Build the result string
  let result = formattedNumber;

  // Add currency symbol
  if (showCurrency) {
    result = `${currencySymbol}${result}`;
  }

  // Add signs
  if (isNegative && showNegativeSign) {
    result = `-${result}`;
  } else if (!isNegative && showPositiveSign) {
    result = `+${result}`;
  }

  return result;
}

/**
 * Format a number with dots for thousands separators and commas for decimal divisions
 *
 * @param value - The number to format
 * @param decimals - Number of decimal places
 * @returns Formatted number string
 */
function formatNumberWithSeparators(value: number, decimals: number): string {
  // Convert to string with fixed decimal places
  const numStr = value.toFixed(decimals);

  // Split into integer and decimal parts
  const [integerPart, decimalPart] = numStr.split(".");

  // Add dots for thousands separators in integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Combine with decimal part (using comma)
  if (decimals > 0 && decimalPart) {
    return `${formattedInteger},${decimalPart}`;
  }

  return formattedInteger;
}

/**
 * Format a number as currency with dots for thousands and commas for decimals
 *
 * @param value - The number to format
 * @param options - Formatting options
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(1234567.89) // "$1.234.567,89"
 * formatCurrency(1234567.89, { currencySymbol: '€' }) // "€1.234.567,89"
 */
export function formatCurrency(
  value: number | string | null | undefined,
  options: Omit<NumberFormatOptions, "showCurrency"> = {}
): string {
  return formatNumber(value, { ...options, showCurrency: true });
}

/**
 * Format a number as a percentage with dots for thousands and commas for decimals
 *
 * @param value - The number to format (as decimal, e.g., 0.123 for 12.3%)
 * @param options - Formatting options
 * @returns Formatted percentage string
 *
 * @example
 * formatPercentage(0.123) // "12,30%"
 * formatPercentage(0.123, { decimals: 1 }) // "12,3%"
 */
export function formatPercentage(
  value: number | string | null | undefined,
  options: Omit<NumberFormatOptions, "showCurrency" | "currencySymbol"> = {}
): string {
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (numValue === null || numValue === undefined || isNaN(numValue)) {
    return options.showZero !== false ? "0%" : "";
  }

  // Convert to percentage (multiply by 100)
  const percentageValue = numValue * 100;
  const formatted = formatNumber(percentageValue, {
    ...options,
    showCurrency: false,
  });

  return `${formatted}%`;
}

/**
 * Parse a formatted number string back to a number
 *
 * @param formattedValue - The formatted number string
 * @returns Parsed number or null if invalid
 *
 * @example
 * parseFormattedNumber("1.234.567,89") // 1234567.89
 * parseFormattedNumber("$1.234.567,89") // 1234567.89
 */
export function parseFormattedNumber(formattedValue: string): number | null {
  if (!formattedValue || typeof formattedValue !== "string") {
    return null;
  }

  // Remove currency symbols and signs
  const cleanValue = formattedValue
    .replace(/[^\d.,-]/g, "") // Remove all non-digit, non-dot, non-comma, non-minus characters
    .replace(/^-/, ""); // Remove leading minus (we'll handle sign separately)

  // Check if original value was negative
  const isNegative = formattedValue.startsWith("-");

  // Replace dots with empty string (thousands separators)
  // Replace comma with dot (decimal separator)
  const normalizedValue = cleanValue
    .replace(/\./g, "") // Remove dots (thousands separators)
    .replace(",", "."); // Replace comma with dot (decimal separator)

  const parsed = parseFloat(normalizedValue);

  if (isNaN(parsed)) {
    return null;
  }

  return isNegative ? -parsed : parsed;
}
