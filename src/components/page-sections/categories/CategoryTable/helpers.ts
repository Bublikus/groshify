import type { Category } from "../types";

/**
 * Toggle a category's expanded state in a Set
 */
export function toggleCategoryExpanded(
  expandedCategories: Set<number>,
  categoryId: number
): Set<number> {
  const newExpanded = new Set(expandedCategories);
  if (newExpanded.has(categoryId)) {
    newExpanded.delete(categoryId);
  } else {
    newExpanded.add(categoryId);
  }
  return newExpanded;
}

/**
 * Expand all categories
 */
export function expandAllCategories(categories: Category[]): Set<number> {
  return new Set(categories.map((cat) => cat.id));
}

/**
 * Collapse all categories
 */
export function collapseAllCategories(): Set<number> {
  return new Set();
}

/**
 * Check if a category is expanded
 */
export function isCategoryExpanded(expandedCategories: Set<number>, categoryId: number): boolean {
  return expandedCategories.has(categoryId);
}

/**
 * Get the number of expanded categories
 */
export function getExpandedCount(expandedCategories: Set<number>): number {
  return expandedCategories.size;
}

/**
 * Get expanded category IDs as an array
 */
export function getExpandedCategoryIds(expandedCategories: Set<number>): number[] {
  return Array.from(expandedCategories);
}

/**
 * Expand specific categories by IDs
 */
export function expandSpecificCategories(
  expandedCategories: Set<number>,
  categoryIds: number[]
): Set<number> {
  const newExpanded = new Set(expandedCategories);
  categoryIds.forEach((id) => newExpanded.add(id));
  return newExpanded;
}

/**
 * Collapse specific categories by IDs
 */
export function collapseSpecificCategories(
  expandedCategories: Set<number>,
  categoryIds: number[]
): Set<number> {
  const newExpanded = new Set(expandedCategories);
  categoryIds.forEach((id) => newExpanded.delete(id));
  return newExpanded;
}

/**
 * Get categories that have subcategories (can be expanded)
 */
export function getExpandableCategories(categories: Category[]): Category[] {
  return categories.filter((category) => category.subcategories.length > 0);
}

/**
 * Get categories that are currently expanded
 */
export function getExpandedCategories(
  categories: Category[],
  expandedCategories: Set<number>
): Category[] {
  return categories.filter((category) => expandedCategories.has(category.id));
}

/**
 * Get categories that are currently collapsed
 */
export function getCollapsedCategories(
  categories: Category[],
  expandedCategories: Set<number>
): Category[] {
  return categories.filter((category) => !expandedCategories.has(category.id));
}
