import { useMemo, useState } from "react";
import type { Category } from "@/components/page-sections/categories/types";
import { TRANSACTION_CATEGORIES } from "@/constants/categories";
import { DEFAULT_CATEGORY_FILTERS } from "./constants";
import {
  calculateCategoryStats,
  filterCategoriesBySearch,
  filterCategoriesByStatus,
  sortCategoriesBySearchRelevance,
} from "./helpers";
import type { UseCategoriesPageReturn } from "./types";

// Transform TRANSACTION_CATEGORIES to match Category interface
const categories: Category[] = TRANSACTION_CATEGORIES.map((cat, index) => ({
  id: index + 1,
  name: cat.name,
  description: cat.description,
  icon: cat.icon,
  color: cat.color,
  transactionCount: 0, // Will be calculated from subcategories
  totalAmount: 0, // Will be calculated from subcategories
  isActive: true,
  subcategories: cat.subcategories.map((subcat, subIndex) => ({
    id: subIndex + 1,
    name: subcat,
    transactionCount: 0,
    totalAmount: 0,
    isActive: true,
  })),
}));

export function useCategoriesPage(): UseCategoriesPageReturn {
  const [filters, setFilters] = useState(DEFAULT_CATEGORY_FILTERS);

  const { searchQuery, statusFilter } = filters;

  const filteredCategories = useMemo(() => {
    // First filter by status
    const statusFiltered = filterCategoriesByStatus(categories, statusFilter);

    // Then filter by search query
    const searchFiltered = filterCategoriesBySearch(statusFiltered, searchQuery);

    // Finally sort by search relevance if there's a search query
    if (searchQuery.trim()) {
      return sortCategoriesBySearchRelevance(searchFiltered, searchQuery);
    }

    return searchFiltered;
  }, [searchQuery, statusFilter]);

  const stats = useMemo(() => {
    return calculateCategoryStats(categories);
  }, []);

  return {
    ...stats,
    categories,
    filteredCategories,
    filters,
    setFilters,
  };
}
