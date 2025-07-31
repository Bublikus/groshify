"use client";

import { CategoryStats } from "./CategoryStats";
import { useCategoryStats } from "./hooks";
import type { CategoryStatsContainerProps } from "./types";

export function CategoryStatsContainer({ categories }: CategoryStatsContainerProps) {
  const stats = useCategoryStats({ categories });

  return <CategoryStats stats={stats} />;
}
