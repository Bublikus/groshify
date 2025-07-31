import type { Category } from "../types";

export interface CategoryStatsData {
  totalCategories: number;
  activeCategories: number;
  totalRules: number;
  totalTransactions: number;
  totalSubcategories: number;
  accuracy: number;
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
 * Calculate total number of rules across all categories
 */
export function calculateTotalRules(categories: Category[]): number {
  return categories.reduce((sum, cat) => sum + cat.rules.length, 0);
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
 * Calculate total number of active rules across all categories
 */
export function calculateActiveRules(categories: Category[]): number {
  return categories.reduce((sum, cat) => sum + cat.rules.filter((rule) => rule.isActive).length, 0);
}

/**
 * Calculate accuracy percentage based on active rules vs total rules
 */
export function calculateAccuracy(totalRules: number, activeRules: number): number {
  return totalRules > 0 ? Math.round((activeRules / totalRules) * 100) : 100;
}

/**
 * Calculate all category statistics in one function
 */
export function calculateCategoryStats(categories: Category[]): CategoryStatsData {
  const totalCategories = calculateTotalCategories(categories);
  const activeCategories = calculateActiveCategories(categories);
  const totalRules = calculateTotalRules(categories);
  const totalTransactions = calculateTotalTransactions(categories);
  const totalSubcategories = calculateTotalSubcategories(categories);
  const activeRules = calculateActiveRules(categories);
  const accuracy = calculateAccuracy(totalRules, activeRules);

  return {
    totalCategories,
    activeCategories,
    totalRules,
    totalTransactions,
    totalSubcategories,
    accuracy,
  };
}
