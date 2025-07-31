"use client";

import type { CategoryFilters } from "@/hooks/page-hooks/categories";
import { CategoryFilters as CategoryFiltersComponent } from "./CategoryFilters";

interface CategoryFiltersContainerProps {
  filters: CategoryFilters;
  onFiltersChange: (filters: CategoryFilters) => void;
}

export function CategoryFiltersContainer({
  filters,
  onFiltersChange,
}: CategoryFiltersContainerProps) {
  const handleSearchChange = (query: string) => {
    const newFilters = { ...filters, searchQuery: query };
    onFiltersChange(newFilters);
  };

  const handleStatusChange = (status: CategoryFilters["statusFilter"]) => {
    const newFilters = { ...filters, statusFilter: status };
    onFiltersChange(newFilters);
  };

  return (
    <CategoryFiltersComponent
      searchQuery={filters.searchQuery}
      statusFilter={filters.statusFilter}
      onSearchChange={handleSearchChange}
      onStatusChange={handleStatusChange}
    />
  );
}
