import type { Category } from "../types";

/**
 * Calculate total number of subcategories across categories
 */
export function calculateTotalSubcategories(categories: Category[]): number {
  return categories.reduce((sum, cat) => sum + cat.subcategories.length, 0);
}

/**
 * Calculate total number of active subcategories across categories
 */
export function calculateActiveSubcategories(categories: Category[]): number {
  return categories.reduce(
    (sum, cat) => sum + cat.subcategories.filter((sub) => sub.isActive).length,
    0
  );
}

/**
 * Calculate total number of inactive subcategories across categories
 */
export function calculateInactiveSubcategories(categories: Category[]): number {
  return categories.reduce(
    (sum, cat) => sum + cat.subcategories.filter((sub) => !sub.isActive).length,
    0
  );
}

/**
 * Get all subcategories from categories
 */
export function getAllSubcategories(categories: Category[]) {
  return categories.flatMap((cat) => cat.subcategories);
}

/**
 * Get active subcategories from categories
 */
export function getActiveSubcategories(categories: Category[]) {
  return categories.flatMap((cat) => cat.subcategories.filter((sub) => sub.isActive));
}

/**
 * Get inactive subcategories from categories
 */
export function getInactiveSubcategories(categories: Category[]) {
  return categories.flatMap((cat) => cat.subcategories.filter((sub) => !sub.isActive));
}

/**
 * Get subcategories for a specific category
 */
export function getCategorySubcategories(categories: Category[], categoryId: number) {
  const category = categories.find((cat) => cat.id === categoryId);
  return category ? category.subcategories : [];
}

/**
 * Get active subcategories for a specific category
 */
export function getCategoryActiveSubcategories(categories: Category[], categoryId: number) {
  const category = categories.find((cat) => cat.id === categoryId);
  return category ? category.subcategories.filter((sub) => sub.isActive) : [];
}

/**
 * Calculate subcategories effectiveness (percentage of active subcategories)
 */
export function calculateSubcategoriesEffectiveness(categories: Category[]): number {
  const totalSubcategories = calculateTotalSubcategories(categories);
  const activeSubcategories = calculateActiveSubcategories(categories);

  return totalSubcategories > 0
    ? Math.round((activeSubcategories / totalSubcategories) * 100)
    : 100;
}

/**
 * Get categories with the most subcategories
 */
export function getCategoriesWithMostSubcategories(categories: Category[]): Category[] {
  return [...categories].sort((a, b) => b.subcategories.length - a.subcategories.length);
}

/**
 * Get categories with no subcategories
 */
export function getCategoriesWithNoSubcategories(categories: Category[]): Category[] {
  return categories.filter((cat) => cat.subcategories.length === 0);
}

/**
 * Get categories with only inactive subcategories
 */
export function getCategoriesWithOnlyInactiveSubcategories(categories: Category[]): Category[] {
  return categories.filter(
    (cat) => cat.subcategories.length > 0 && cat.subcategories.every((sub) => !sub.isActive)
  );
}

/**
 * Calculate total transaction count across all categories
 */
export function calculateTotalTransactions(categories: Category[]): number {
  return categories.reduce((sum, cat) => sum + cat.transactionCount, 0);
}

/**
 * Calculate total amount across all categories
 */
export function calculateTotalAmount(categories: Category[]): number {
  return categories.reduce((sum, cat) => sum + cat.totalAmount, 0);
}
