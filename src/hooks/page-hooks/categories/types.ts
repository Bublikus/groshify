import type { Category } from "@/components/page-sections/categories/types";

export type FilterStatus = "All" | "Active" | "Inactive";

export interface CategoryFilters {
  searchQuery: string;
  statusFilter: FilterStatus;
}

export interface CategoryStats {
  totalCategories: number;
  activeCategories: number;
  inactiveCategories: number;
}

export interface UseCategoriesPageReturn extends CategoryStats {
  categories: Category[];
  filteredCategories: Category[];
  filters: CategoryFilters;
  setFilters: (filters: CategoryFilters) => void;
}
