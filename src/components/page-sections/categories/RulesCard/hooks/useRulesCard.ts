import { useMemo } from "react";
import type { Category } from "../../types";
import { calculateActiveRules, calculateTotalRules, getDisplayCategories } from "../helpers";

interface UseRulesCardProps {
  categories: Category[];
}

interface UseRulesCardReturn {
  displayCategories: Category[];
  totalRules: number;
  activeRules: number;
}

export function useRulesCard({ categories }: UseRulesCardProps): UseRulesCardReturn {
  const displayCategories = useMemo(() => getDisplayCategories(categories), [categories]);

  const totalRules = useMemo(() => calculateTotalRules(displayCategories), [displayCategories]);

  const activeRules = useMemo(() => calculateActiveRules(displayCategories), [displayCategories]);

  return {
    displayCategories,
    totalRules,
    activeRules,
  };
}
