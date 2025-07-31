import { useMemo } from "react";
import type { Category } from "../../types";
import { calculateActiveSubcategories, calculateTotalSubcategories } from "../helpers";

interface UseRulesCardProps {
  categories: Category[];
}

interface UseRulesCardReturn {
  categories: Category[];
  totalSubcategories: number;
  activeSubcategories: number;
}

export function useRulesCard({ categories }: UseRulesCardProps): UseRulesCardReturn {
  const totalSubcategories = useMemo(() => calculateTotalSubcategories(categories), [categories]);
  const activeSubcategories = useMemo(() => calculateActiveSubcategories(categories), [categories]);

  return {
    categories,
    totalSubcategories,
    activeSubcategories,
  };
}
