import { useMemo } from "react";
import type { Category } from "../../types";

interface UseCategoryStatsProps {
  categories: Category[];
}

interface CategoryStatsData {
  totalCategories: number;
  activeCategories: number;
  totalRules: number;
  totalTransactions: number;
  totalSubcategories: number;
  accuracy: number;
}

export function useCategoryStats({ categories }: UseCategoryStatsProps): CategoryStatsData {
  const stats = useMemo(() => {
    const totalCategories = categories.length;
    const activeCategories = categories.filter((cat) => cat.isActive).length;
    const totalRules = categories.reduce((sum, cat) => sum + cat.rules.length, 0);
    const totalTransactions = categories.reduce((sum, cat) => sum + cat.transactionCount, 0);
    const totalSubcategories = categories.reduce((sum, cat) => sum + cat.subcategories.length, 0);

    // Calculate accuracy based on active rules vs total rules
    const activeRules = categories.reduce(
      (sum, cat) => sum + cat.rules.filter((rule) => rule.isActive).length,
      0
    );
    const accuracy = totalRules > 0 ? Math.round((activeRules / totalRules) * 100) : 100;

    return {
      totalCategories,
      activeCategories,
      totalRules,
      totalTransactions,
      totalSubcategories,
      accuracy,
    };
  }, [categories]);

  return stats;
}
