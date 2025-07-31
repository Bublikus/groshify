import { useMemo } from "react";
import type { Category } from "../../types";

interface UseRulesCardProps {
  categories: Category[];
}

interface UseRulesCardReturn {
  displayCategories: Category[];
  totalRules: number;
  activeRules: number;
}

export function useRulesCard({ categories }: UseRulesCardProps): UseRulesCardReturn {
  const displayCategories = useMemo(() => categories.slice(0, 3), [categories]);

  const totalRules = useMemo(
    () => displayCategories.reduce((sum, cat) => sum + cat.rules.length, 0),
    [displayCategories]
  );

  const activeRules = useMemo(
    () =>
      displayCategories.reduce(
        (sum, cat) => sum + cat.rules.filter((rule) => rule.isActive).length,
        0
      ),
    [displayCategories]
  );

  return {
    displayCategories,
    totalRules,
    activeRules,
  };
}
