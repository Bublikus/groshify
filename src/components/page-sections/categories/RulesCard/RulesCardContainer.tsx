"use client";

import type { Category } from "../types";
import { RulesCard } from "./RulesCard";
import { useRulesCard } from "./hooks";

interface RulesCardContainerProps {
  categories: Category[];
}

export function RulesCardContainer({ categories }: RulesCardContainerProps) {
  const { displayCategories, totalRules, activeRules } = useRulesCard({ categories });

  return (
    <RulesCard
      displayCategories={displayCategories}
      totalRules={totalRules}
      activeRules={activeRules}
    />
  );
}
