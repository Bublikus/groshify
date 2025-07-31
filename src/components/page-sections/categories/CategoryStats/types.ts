export interface CategoryStatsProps {
  stats: {
    totalCategories: number;
    activeCategories: number;
    totalRules: number;
    totalTransactions: number;
    totalSubcategories: number;
    accuracy: number;
  };
}

export interface CategoryStatsContainerProps {
  categories: import("../types").Category[];
}
