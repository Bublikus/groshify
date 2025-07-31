import type { Category } from "../types";

export interface SubcategoriesProps {
  categories: Category[];
  totalCategories?: number;
  totalSubcategories?: number;
}

export interface SubcategoriesContainerProps {
  categories: Category[];
}
