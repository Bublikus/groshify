import { useMemo } from "react";
import type { Category } from "../../types";
import { calculateActiveSubcategories, calculateTotalSubcategories } from "../helpers";

interface UseSubcategoriesProps {
  categories: Category[];
}

interface UseSubcategoriesReturn {
  categories: Category[];
  totalSubcategories: number;
  activeSubcategories: number;
}

export function useSubcategories({ categories }: UseSubcategoriesProps): UseSubcategoriesReturn {
  const totalSubcategories = useMemo(() => calculateTotalSubcategories(categories), [categories]);
  const activeSubcategories = useMemo(() => calculateActiveSubcategories(categories), [categories]);

  return {
    categories,
    totalSubcategories,
    activeSubcategories,
  };
}
