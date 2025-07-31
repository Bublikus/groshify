import type { Category } from "@/components/page-sections/categories/types";
import { SEARCH_SCORE_WEIGHTS } from "./constants";
import type { CategoryFilters } from "./types";

/**
 * Filters categories by status (All, Active, Inactive)
 */
export function filterCategoriesByStatus(
  categories: Category[],
  statusFilter: CategoryFilters["statusFilter"]
): Category[] {
  return categories.filter((category) => {
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" && category.isActive) ||
      (statusFilter === "Inactive" && !category.isActive);

    return matchesStatus;
  });
}

/**
 * Filters categories by search query
 */
export function filterCategoriesBySearch(categories: Category[], searchQuery: string): Category[] {
  if (!searchQuery.trim()) return categories;

  const query = searchQuery.toLowerCase();
  return categories.filter((category) => {
    return (
      category.name.toLowerCase().includes(query) ||
      category.description.toLowerCase().includes(query) ||
      category.subcategories.some((subcat) => subcat.name.toLowerCase().includes(query))
    );
  });
}

/**
 * Sorts categories by search relevance
 * Prioritizes: exact matches > starts with > contains
 */
export function sortCategoriesBySearchRelevance(
  categories: Category[],
  searchQuery: string,
  caseSensitive: boolean = false
): Category[] {
  if (!searchQuery.trim()) return categories;

  const query = caseSensitive ? searchQuery : searchQuery.toLowerCase();

  return [...categories].sort((a, b) => {
    const aScore = getCategorySearchScore(a, query, caseSensitive);
    const bScore = getCategorySearchScore(b, query, caseSensitive);

    // Higher score means better match
    return bScore - aScore;
  });
}

/**
 * Calculates search relevance score for a category
 */
function getCategorySearchScore(category: Category, query: string, caseSensitive: boolean): number {
  let maxScore = 0;

  // Check category name
  const nameValue = caseSensitive ? category.name : category.name.toLowerCase();
  maxScore = Math.max(maxScore, getFieldSearchScore(nameValue, query, caseSensitive));

  // Check category description
  const descValue = caseSensitive ? category.description : category.description.toLowerCase();
  maxScore = Math.max(maxScore, getFieldSearchScore(descValue, query, caseSensitive));

  // Check subcategory names
  const subcategoryNames = category.subcategories.map((sub) => sub.name).join(" ");
  const subValue = caseSensitive ? subcategoryNames : subcategoryNames.toLowerCase();
  maxScore = Math.max(maxScore, getFieldSearchScore(subValue, query, caseSensitive));

  return maxScore;
}

/**
 * Calculates search score for a single field
 */
function getFieldSearchScore(fieldValue: string, query: string, caseSensitive: boolean): number {
  const itemValue = caseSensitive ? fieldValue : fieldValue.toLowerCase();

  // Exact match gets highest score
  if (itemValue === query) {
    return SEARCH_SCORE_WEIGHTS.EXACT_MATCH;
  }
  // Starts with query gets medium score
  else if (itemValue.startsWith(query)) {
    return SEARCH_SCORE_WEIGHTS.STARTS_WITH;
  }
  // Contains query gets lowest score
  else if (itemValue.includes(query)) {
    return SEARCH_SCORE_WEIGHTS.CONTAINS;
  }

  return SEARCH_SCORE_WEIGHTS.NO_MATCH;
}

/**
 * Calculates category statistics
 */
export function calculateCategoryStats(categories: Category[]) {
  const totalCategories = categories.length;
  const activeCategories = categories.filter((cat) => cat.isActive).length;
  const inactiveCategories = totalCategories - activeCategories;

  return {
    totalCategories,
    activeCategories,
    inactiveCategories,
  };
}
