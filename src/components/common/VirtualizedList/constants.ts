/**
 * Constants for VirtualizedList component
 */

export const VIRTUALIZED_LIST_CONSTANTS = {
  DEFAULT_ITEM_HEIGHT: 50,
  DEFAULT_HEIGHT: "400px",
  DEFAULT_OVERSCAN: 5,
  DEFAULT_EMPTY_MESSAGE: "No items found",
  DEFAULT_LOADING_MESSAGE: "Loading...",
  DEFAULT_MIN_HEIGHT: "200px",
  DEFAULT_MAX_HEIGHT: "80vh",
  ADAPTIVE_HEIGHT_THRESHOLD: 100, // Minimum items to trigger adaptive height
} as const;
