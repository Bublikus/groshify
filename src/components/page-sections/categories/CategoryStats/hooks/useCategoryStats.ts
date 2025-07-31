import { useMemo } from "react";
import type { Category } from "../../types";
import { calculateCategoryStats } from "../helpers";

interface UseCategoryStatsProps {
  categories: Category[];
}

export function useCategoryStats({ categories }: UseCategoryStatsProps) {
  const stats = useMemo(() => calculateCategoryStats(categories), [categories]);

  return stats;
}
