import type { Category } from "../types";
import { DEBOUNCE_DELAY, PROBLEMATIC_CHARS_REGEX, SEARCH_QUERY_LIMITS } from "./constants";
import type { FilterStatus } from "./hooks";

/**
 * Filter categories by search query (case-insensitive)
 */
export function filterCategoriesBySearch(categories: Category[], searchQuery: string): Category[] {
  if (!searchQuery.trim()) {
    return categories;
  }

  const query = searchQuery.toLowerCase().trim();

  return categories.filter((category) => {
    // Search in category name
    if (category.name.toLowerCase().includes(query)) {
      return true;
    }

    // Search in category description
    if (category.description.toLowerCase().includes(query)) {
      return true;
    }

    // Search in subcategory names
    if (category.subcategories.some((subcat) => subcat.name.toLowerCase().includes(query))) {
      return true;
    }

    // Search in rule values
    if (category.rules.some((rule) => rule.value.toLowerCase().includes(query))) {
      return true;
    }

    return false;
  });
}

/**
 * Filter categories by status
 */
export function filterCategoriesByStatus(
  categories: Category[],
  statusFilter: FilterStatus
): Category[] {
  switch (statusFilter) {
    case "Active":
      return categories.filter((category) => category.isActive);
    case "Inactive":
      return categories.filter((category) => !category.isActive);
    case "All":
    default:
      return categories;
  }
}

/**
 * Filter categories by both search query and status
 */
export function filterCategories(
  categories: Category[],
  searchQuery: string,
  statusFilter: FilterStatus
): Category[] {
  const searchFiltered = filterCategoriesBySearch(categories, searchQuery);
  return filterCategoriesByStatus(searchFiltered, statusFilter);
}

/**
 * Get filter options for status dropdown
 */
export function getStatusFilterOptions(): Array<{ value: FilterStatus; label: string }> {
  return [
    { value: "All", label: "All Categories" },
    { value: "Active", label: "Active Only" },
    { value: "Inactive", label: "Inactive Only" },
  ];
}

/**
 * Validate search query (e.g., minimum length, special characters)
 */
export function validateSearchQuery(query: string): { isValid: boolean; error?: string } {
  if (query.length > SEARCH_QUERY_LIMITS.MAX_LENGTH) {
    return { isValid: false, error: "Search query too long" };
  }

  // Check for potentially problematic characters
  if (PROBLEMATIC_CHARS_REGEX.test(query)) {
    return { isValid: false, error: "Invalid characters in search query" };
  }

  return { isValid: true };
}

/**
 * Debounce search query to avoid excessive filtering
 */
export function debounceSearchQuery(
  query: string,
  delay: number = DEBOUNCE_DELAY
): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(query), delay);
  });
}
