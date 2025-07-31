import type { Category } from "../types";

export interface CategoryStatsData {
  totalCategories: number;
  activeCategories: number;
  totalSubcategories: number;
  activeSubcategories: number;
  totalTransactions: number;
  effectiveness: number;
}

/**
 * Calculate total number of categories
 */
export function calculateTotalCategories(categories: Category[]): number {
  return categories.length;
}

/**
 * Calculate number of active categories
 */
export function calculateActiveCategories(categories: Category[]): number {
  return categories.filter((cat) => cat.isActive).length;
}

/**
 * Calculate total number of transactions across all categories
 */
export function calculateTotalTransactions(categories: Category[]): number {
  return categories.reduce((sum, cat) => sum + cat.transactionCount, 0);
}

/**
 * Calculate total number of subcategories across all categories
 */
export function calculateTotalSubcategories(categories: Category[]): number {
  return categories.reduce((sum, cat) => sum + cat.subcategories.length, 0);
}

/**
 * Calculate total number of active subcategories across all categories
 */
export function calculateActiveSubcategories(categories: Category[]): number {
  return categories.reduce(
    (sum, cat) => sum + cat.subcategories.filter((sub) => sub.isActive).length,
    0
  );
}

/**
 * Calculate effectiveness percentage based on active subcategories vs total subcategories
 */
export function calculateEffectiveness(
  totalSubcategories: number,
  activeSubcategories: number
): number {
  return totalSubcategories > 0
    ? Math.round((activeSubcategories / totalSubcategories) * 100)
    : 100;
}

/**
 * Calculate all category statistics in one function
 */
export function calculateCategoryStats(categories: Category[]): CategoryStatsData {
  const totalCategories = calculateTotalCategories(categories);
  const activeCategories = calculateActiveCategories(categories);
  const totalSubcategories = calculateTotalSubcategories(categories);
  const activeSubcategories = calculateActiveSubcategories(categories);
  const totalTransactions = calculateTotalTransactions(categories);
  const effectiveness = calculateEffectiveness(totalSubcategories, activeSubcategories);

  return {
    totalCategories,
    activeCategories,
    totalSubcategories,
    activeSubcategories,
    totalTransactions,
    effectiveness,
  };
}
