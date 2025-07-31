import type { Category } from "../types";

export interface CategoryTableProps {
  categories: Category[];
  expandedCategories: Set<number>;
  onToggleCategory: (categoryId: number) => void;
}

export interface CategoryTableContainerProps {
  categories: Category[];
}
