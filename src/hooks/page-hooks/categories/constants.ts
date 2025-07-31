import type { CategoryFilters } from "./types";

/**
 * Default filter values for categories page
 */
export const DEFAULT_CATEGORY_FILTERS: CategoryFilters = {
  searchQuery: "",
  statusFilter: "All",
};

/**
 * Search relevance scoring weights
 */
export const SEARCH_SCORE_WEIGHTS = {
  EXACT_MATCH: 3,
  STARTS_WITH: 2,
  CONTAINS: 1,
  NO_MATCH: 0,
} as const;
