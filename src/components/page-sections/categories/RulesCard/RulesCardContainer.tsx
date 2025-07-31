"use client";

import { RulesCard } from "./RulesCard";
import { useRulesCard } from "./hooks";
import type { RulesCardContainerProps } from "./types";

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
