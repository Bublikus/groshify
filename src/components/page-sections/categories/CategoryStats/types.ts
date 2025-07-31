import type { Category } from "../types";

export interface CategoryStatsProps {
  stats: {
    totalCategories: number;
    activeCategories: number;
    totalSubcategories: number;
    activeSubcategories: number;
    totalTransactions: number;
    effectiveness: number;
  };
}

export interface CategoryStatsContainerProps {
  categories: Category[];
}
