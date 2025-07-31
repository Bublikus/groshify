import type { Category, CategoryRule } from "../types";

/**
 * Get categories to display in the rules card (limited to first N)
 */
export function getDisplayCategories(categories: Category[], limit: number = 3): Category[] {
  return categories.slice(0, limit);
}

/**
 * Calculate total number of rules across categories
 */
export function calculateTotalRules(categories: Category[]): number {
  return categories.reduce((sum, cat) => sum + cat.rules.length, 0);
}

/**
 * Calculate total number of active rules across categories
 */
export function calculateActiveRules(categories: Category[]): number {
  return categories.reduce((sum, cat) => sum + cat.rules.filter((rule) => rule.isActive).length, 0);
}

/**
 * Calculate total number of inactive rules across categories
 */
export function calculateInactiveRules(categories: Category[]): number {
  return categories.reduce(
    (sum, cat) => sum + cat.rules.filter((rule) => !rule.isActive).length,
    0
  );
}

/**
 * Get all rules from categories
 */
export function getAllRules(categories: Category[]): CategoryRule[] {
  return categories.flatMap((cat) => cat.rules);
}

/**
 * Get active rules from categories
 */
export function getActiveRules(categories: Category[]): CategoryRule[] {
  return categories.flatMap((cat) => cat.rules.filter((rule) => rule.isActive));
}

/**
 * Get inactive rules from categories
 */
export function getInactiveRules(categories: Category[]): CategoryRule[] {
  return categories.flatMap((cat) => cat.rules.filter((rule) => !rule.isActive));
}

/**
 * Get rules for a specific category
 */
export function getCategoryRules(categories: Category[], categoryId: number): CategoryRule[] {
  const category = categories.find((cat) => cat.id === categoryId);
  return category ? category.rules : [];
}

/**
 * Get active rules for a specific category
 */
export function getCategoryActiveRules(categories: Category[], categoryId: number): CategoryRule[] {
  const category = categories.find((cat) => cat.id === categoryId);
  return category ? category.rules.filter((rule) => rule.isActive) : [];
}

/**
 * Calculate rules effectiveness (percentage of active rules)
 */
export function calculateRulesEffectiveness(categories: Category[]): number {
  const totalRules = calculateTotalRules(categories);
  const activeRules = calculateActiveRules(categories);

  return totalRules > 0 ? Math.round((activeRules / totalRules) * 100) : 100;
}

/**
 * Get categories with the most rules
 */
export function getCategoriesWithMostRules(categories: Category[], limit: number = 5): Category[] {
  return [...categories].sort((a, b) => b.rules.length - a.rules.length).slice(0, limit);
}

/**
 * Get categories with no rules
 */
export function getCategoriesWithNoRules(categories: Category[]): Category[] {
  return categories.filter((cat) => cat.rules.length === 0);
}

/**
 * Get categories with only inactive rules
 */
export function getCategoriesWithOnlyInactiveRules(categories: Category[]): Category[] {
  return categories.filter(
    (cat) => cat.rules.length > 0 && cat.rules.every((rule) => !rule.isActive)
  );
}

/**
 * Validate rule data
 */
export function validateRule(rule: CategoryRule): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!rule.condition || rule.condition.trim() === "") {
    errors.push("Rule condition is required");
  }

  if (!rule.value || rule.value.trim() === "") {
    errors.push("Rule value is required");
  }

  if (rule.value && rule.value.length > 100) {
    errors.push("Rule value too long (max 100 characters)");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
