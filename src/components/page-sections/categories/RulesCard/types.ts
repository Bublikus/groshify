import type { Category } from "../types";

export interface RulesCardProps {
  categories: Category[];
  totalCategories?: number;
  totalSubcategories?: number;
}

export interface RulesCardContainerProps {
  categories: Category[];
}
