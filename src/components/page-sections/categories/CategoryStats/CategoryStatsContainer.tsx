"use client";

import type { Category } from "../types";
import { CategoryStats } from "./CategoryStats";
import { useCategoryStats } from "./hooks";

interface CategoryStatsContainerProps {
  categories: Category[];
}

export function CategoryStatsContainer({ categories }: CategoryStatsContainerProps) {
  const stats = useCategoryStats({ categories });

  return <CategoryStats stats={stats} />;
}
