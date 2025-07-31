import { useCallback, useState } from "react";

export type FilterStatus = "All" | "Active" | "Inactive";

interface UseCategoryFiltersReturn {
  searchQuery: string;
  statusFilter: FilterStatus;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: FilterStatus) => void;
  resetFilters: () => void;
}

export function useCategoryFilters(): UseCategoryFiltersReturn {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("All");

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("All");
  }, []);

  return {
    searchQuery,
    statusFilter,
    setSearchQuery,
    setStatusFilter,
    resetFilters,
  };
}
