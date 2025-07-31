"use client";

import { CategoryTable } from "./CategoryTable";
import { useCategoryTable } from "./hooks";
import type { CategoryTableContainerProps } from "./types";

export function CategoryTableContainer({ categories }: CategoryTableContainerProps) {
  const { expandedCategories, toggleCategory } = useCategoryTable({ categories });

  return (
    <CategoryTable
      categories={categories}
      expandedCategories={expandedCategories}
      onToggleCategory={toggleCategory}
    />
  );
}
