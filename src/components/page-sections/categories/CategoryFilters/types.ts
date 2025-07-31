import type { FilterStatus } from "./hooks";

export interface CategoryFiltersProps {
  searchQuery: string;
  statusFilter: FilterStatus;
  onSearchChange: (query: string) => void;
  onStatusChange: (status: FilterStatus) => void;
}
