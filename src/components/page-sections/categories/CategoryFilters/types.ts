import type { FilterStatus } from "@/hooks/page-hooks/categories";

export interface CategoryFiltersProps {
  searchQuery: string;
  statusFilter: FilterStatus;
  onSearchChange: (query: string) => void;
  onStatusChange: (status: FilterStatus) => void;
}
