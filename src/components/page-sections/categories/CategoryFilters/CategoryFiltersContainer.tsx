"use client";

import { CategoryFilters } from "./CategoryFilters";
import { useCategoryFilters } from "./hooks";

export function CategoryFiltersContainer() {
  const { searchQuery, statusFilter, setSearchQuery, setStatusFilter } = useCategoryFilters();

  return (
    <CategoryFilters
      searchQuery={searchQuery}
      statusFilter={statusFilter}
      onSearchChange={setSearchQuery}
      onStatusChange={setStatusFilter}
    />
  );
}
