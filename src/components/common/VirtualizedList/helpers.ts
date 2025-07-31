import { VIRTUALIZED_LIST_CONSTANTS } from "./constants";
import { VirtualizedListProps } from "./types";

/**
 * Generates a unique key for list items
 */
export function generateItemKey<TData extends Record<string, unknown>>(
  item: TData,
  index: number,
  itemKey?: VirtualizedListProps<TData>["itemKey"]
): string {
  if (typeof itemKey === "function") {
    return itemKey(item, index);
  }

  if (typeof itemKey === "string" && itemKey in item) {
    return String((item as Record<string, unknown>)[itemKey]);
  }

  // Fallback to index if no valid key is provided
  return `item-${index}`;
}

/**
 * Validates item height to ensure it's a positive number
 */
export function validateItemHeight(height?: number): number {
  if (typeof height === "number" && height > 0) {
    return height;
  }
  return VIRTUALIZED_LIST_CONSTANTS.DEFAULT_ITEM_HEIGHT;
}

/**
 * Validates overscan value to ensure it's a non-negative number
 */
export function validateOverscan(overscan?: number): number {
  if (typeof overscan === "number" && overscan >= 0) {
    return overscan;
  }
  return VIRTUALIZED_LIST_CONSTANTS.DEFAULT_OVERSCAN;
}

/**
 * Calculates adaptive height based on data length and item height
 */
export function calculateAdaptiveHeight(
  dataLength: number,
  itemHeight: number,
  minHeight?: string | number,
  maxHeight?: string | number
): string {
  const calculatedHeight = Math.min(
    dataLength * itemHeight,
    window.innerHeight * 0.8 // 80% of viewport height
  );

  const minHeightValue =
    typeof minHeight === "number"
      ? minHeight
      : typeof minHeight === "string"
        ? parseInt(minHeight)
        : parseInt(VIRTUALIZED_LIST_CONSTANTS.DEFAULT_MIN_HEIGHT);

  const maxHeightValue =
    typeof maxHeight === "number"
      ? maxHeight
      : typeof maxHeight === "string"
        ? parseInt(maxHeight)
        : window.innerHeight * 0.8;

  const finalHeight = Math.max(minHeightValue, Math.min(calculatedHeight, maxHeightValue));

  return `${finalHeight}px`;
}

/**
 * Determines if adaptive height should be used
 */
export function shouldUseAdaptiveHeight(dataLength: number, adaptiveHeight?: boolean): boolean {
  if (adaptiveHeight === false) return false;
  if (adaptiveHeight === true) return true;

  // Auto-detect: use adaptive height for smaller datasets
  return dataLength < VIRTUALIZED_LIST_CONSTANTS.ADAPTIVE_HEIGHT_THRESHOLD;
}

/**
 * Validates and processes height prop
 */
export function processHeightProp(
  height?: string | number,
  adaptiveHeight?: boolean,
  dataLength?: number,
  itemHeight?: number,
  minHeight?: string | number,
  maxHeight?: string | number
): string {
  // If height is explicitly provided, use it
  if (height !== undefined) {
    if (typeof height === "number") {
      return `${height}px`;
    }
    return height;
  }

  // If adaptive height is enabled and we have data, calculate adaptive height
  if (adaptiveHeight && dataLength && itemHeight) {
    return calculateAdaptiveHeight(dataLength, itemHeight, minHeight, maxHeight);
  }

  // Default height
  return VIRTUALIZED_LIST_CONSTANTS.DEFAULT_HEIGHT;
}
