"use client";

import { RulesCard } from "./RulesCard";
import type { RulesCardContainerProps } from "./types";

export function RulesCardContainer({ categories }: RulesCardContainerProps) {
  const totalCategories = categories.length;
  const totalSubcategories = categories.reduce((sum, cat) => sum + cat.subcategories.length, 0);

  return (
    <RulesCard
      categories={categories}
      totalCategories={totalCategories}
      totalSubcategories={totalSubcategories}
    />
  );
}
